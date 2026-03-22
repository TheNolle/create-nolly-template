import fs from 'fs-extra'
import path from 'path'
import type { BaseTemplate, Feature, FilePatch, FilePatchOperation } from './registry/types.js'
import { TEMPLATES_ROOT } from './paths.js'

function mergeIntoPackageJson(pkg: Record<string, any>, dependencies?: Record<string, string>, devDependencies?: Record<string, string>) {
  if (dependencies) pkg.dependencies = { ...pkg.dependencies, ...dependencies }
  if (devDependencies) pkg.devDependencies = { ...pkg.devDependencies, ...devDependencies }
}

function applyReplacements(content: string, answers: Record<string, string>): string {
  let result = content
  for (const [key, value] of Object.entries(answers)) result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  return result
}

function toRegExp(pattern: string | RegExp): RegExp {
  return typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern
}

function applyPatchOperations(content: string, operations: FilePatchOperation[]): string {
  let result = content
  for (const op of operations) {
    if (op.type === 'deleteFile') continue
    const regex = 'pattern' in op ? toRegExp(op.pattern) : undefined
    if (op.type === 'replace' && regex) {
      result = result.replace(regex, op.replacement)
    } else if (op.type === 'remove' && regex) {
      result = result.replace(regex, '')
    } else if (op.type === 'insertBefore' && regex) {
      result = result.replace(regex, match => `${op.insert}\n${match}`)
    } else if (op.type === 'insertAfter' && regex) {
      result = result.replace(regex, match => `${match}\n${op.insert}`)
    }
  }
  return result
}

function applyPatches(fileMap: Map<string, string>, patches: FilePatch[]) {
  for (const patch of patches) {
    const hasDelete = patch.operations.some(op => op.type === 'deleteFile')
    if (hasDelete) {
      fileMap.delete(patch.targetPath)
      continue
    }
    const current = fileMap.get(patch.targetPath)
    if (!current) continue
    const next = applyPatchOperations(current, patch.operations)
    fileMap.set(patch.targetPath, next)
  }
}

async function loadDirectoryIntoMap(root: string, baseDir: string, fileMap: Map<string, string>) {
  const entries = await fs.readdir(root, { withFileTypes: true })
  for (const entry of entries) {
    const absolute = path.join(root, entry.name)
    const relative = path.relative(baseDir, absolute).replace(/\\/g, '/')
    if (entry.isDirectory()) {
      await loadDirectoryIntoMap(absolute, baseDir, fileMap)
    } else {
      const content = await fs.readFile(absolute, 'utf-8')
      fileMap.set(relative, content)
    }
  }
}

export async function buildProject(template: BaseTemplate, selectedFeatures: Feature[], answers: Record<string, string>, outputDir: string) {
  for (const feature of selectedFeatures) {
    for (const conflict of feature.conflicts ?? []) {
      if (selectedFeatures.some(f => f.key === conflict)) {
        throw new Error(`Cannot select "${feature.name}" because it conflicts with "${conflict}"`)
      }
    }
  }
  const fileMap = new Map<string, string>()
  const baseRoot = path.join(TEMPLATES_ROOT, template.templateRoot)
  await loadDirectoryIntoMap(baseRoot, baseRoot, fileMap)
  const pkgRaw = fileMap.get('package.json')
  const pkg = pkgRaw ? JSON.parse(pkgRaw) : {}
  mergeIntoPackageJson(pkg, template.dependencies, template.devDependencies)
  for (const feature of selectedFeatures) {
    if (feature.templateRoot) {
      const featureRoot = path.join(TEMPLATES_ROOT, feature.templateRoot)
      await loadDirectoryIntoMap(featureRoot, featureRoot, fileMap)
    }
    mergeIntoPackageJson(pkg, feature.dependencies, feature.devDependencies)
  }
  const allPatches = selectedFeatures.flatMap(f => f.patches ?? [])
  applyPatches(fileMap, allPatches)
  fileMap.set('package.json', JSON.stringify(pkg, null, 2))
  await fs.ensureDir(outputDir)
  for (const [filePath, content] of fileMap.entries()) {
    const fullPath = path.join(outputDir, filePath)
    await fs.outputFile(fullPath, applyReplacements(content, answers))
  }
}