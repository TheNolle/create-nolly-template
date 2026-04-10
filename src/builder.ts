import fs from 'fs-extra'
import path from 'path'
import type { BaseTemplate, Feature, FilePatch, FilePatchOperation, SuccessMessageConfig } from './registry/types.js'
import { TEMPLATES_ROOT } from './paths.js'

function mergeIntoPackageJson(pkg: Record<string, any>, dependencies?: Record<string, string>, devDependencies?: Record<string, string>) {
  if (dependencies) pkg.dependencies = { ...pkg.dependencies, ...dependencies }
  if (devDependencies) pkg.devDependencies = { ...pkg.devDependencies, ...devDependencies }
}

function addCommandsToPackageJson(pkg: Record<string, any>, commands?: Record<string, string>) {
  if (commands) pkg.scripts = { ...pkg.scripts, ...commands }
}

function applyReplacements(content: string, answers: Record<string, string>): string {
  let result = content
  for (const [key, value] of Object.entries(answers)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }
  return result
}

function applyPathReplacements(filePath: string, answers: Record<string, string>): string {
  let result = filePath
  for (const [key, value] of Object.entries(answers)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }
  return result
}

function applyTemplateString(value: string, answers: Record<string, string>): string {
  let result = value
  for (const [key, replacement] of Object.entries(answers)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), replacement)
  }
  return result
}

export function resolveSuccessMessage(template: BaseTemplate, selectedFeatures: Feature[], outputDir: string, answers: Record<string, string>): SuccessMessageConfig {
  const usesPackageJson = template.usesPackageJson !== false
  const resolved: SuccessMessageConfig = {
    title: '✅ Project created at',
    showBase: true,
    showFeatures: true,
    installCommand: usesPackageJson ? `cd ${outputDir} && pnpm install` : null,
    messages: []
  }
  if (template.successMessage) {
    Object.assign(resolved, template.successMessage)
  }
  for (const feature of selectedFeatures) {
    if (feature.successMessage) {
      Object.assign(resolved, feature.successMessage)
    }
    if (feature.successMessage?.messages) {
      resolved.messages = [...feature.successMessage.messages]
      continue
    }
    if (feature.additionalMessages?.length) {
      resolved.messages = [...(resolved.messages ?? []), ...feature.additionalMessages]
    }
  }
  return {
    ...resolved,
    title: resolved.title ? applyTemplateString(resolved.title, answers) : resolved.title,
    installCommand: resolved.installCommand ? applyTemplateString(resolved.installCommand, answers) : resolved.installCommand,
    messages: (resolved.messages ?? []).map(message => applyTemplateString(message, answers))
  }
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

function createDerivedAnswers(answers: Record<string, string>): Record<string, string> {
  const group = (answers.group ?? '').trim().replace(/^\.|\.$/g, '').replace(/\s+/g, '').replace(/\.{2,}/g, '.')
  const name = (answers.name ?? '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-')
  const displayname = (answers.displayname ?? name).trim()
  const className = displayname.replace(/[^a-zA-Z0-9]+/g, '')
  const groupPath = group.replace(/\./g, '/')
  return { ...answers, group, groupPath, name, displayname, className }
}

export async function buildProject(template: BaseTemplate, selectedFeatures: Feature[], answers: Record<string, string>, outputDir: string) {
  for (const feature of selectedFeatures) {
    if (feature.group && feature.exclusive) {
      const conflict = selectedFeatures.find(f => f.group === feature.group && f.key !== feature.key)
      if (conflict) {
        throw new Error(`Cannot select "${feature.name}" because it is exclusive with "${conflict.name}" in group "${feature.group}"`)
      }
    }
  }
  const sortedFeatures: Feature[] = []
  const visited = new Set<string>()
  const featureMap = new Map(selectedFeatures.map(f => [f.key, f] as const))
  const visit = (feat: Feature) => {
    if (visited.has(feat.key)) return
    visited.add(feat.key)
    if (feat.requires) {
      for (const depKey of feat.requires) {
        const dep = featureMap.get(depKey)
        if (!dep) {
          throw new Error(`Feature "${feat.name}" requires unknown feature "${depKey}"`)
        }
        visit(dep)
      }
    }
    sortedFeatures.push(feat)
  }
  selectedFeatures.forEach(visit)
  const fileMap = new Map<string, string>()
  const baseRoot = path.join(TEMPLATES_ROOT, template.templateRoot)
  await loadDirectoryIntoMap(baseRoot, baseRoot, fileMap)
  const usesPackageJson = template.usesPackageJson !== false
  const pkgRaw = usesPackageJson ? fileMap.get('package.json') : undefined
  const pkg = pkgRaw ? JSON.parse(pkgRaw) : {}
  if (usesPackageJson) {
    mergeIntoPackageJson(pkg, template.dependencies, template.devDependencies)
  }
  for (const feature of sortedFeatures) {
    if (feature.templateRoot) {
      const featureRoot = path.join(TEMPLATES_ROOT, feature.templateRoot)
      await loadDirectoryIntoMap(featureRoot, featureRoot, fileMap)
    }
    if (usesPackageJson) {
      mergeIntoPackageJson(pkg, feature.dependencies, feature.devDependencies)
    }
  }
  if (usesPackageJson) {
    addCommandsToPackageJson(pkg, template.commands)
    for (const feature of sortedFeatures) {
      addCommandsToPackageJson(pkg, feature.commands)
    }
    fileMap.set('package.json', JSON.stringify(pkg, null, 2))
  } else {
    fileMap.delete('package.json')
  }
  const allPatches = sortedFeatures.flatMap(f => f.patches ?? [])
  applyPatches(fileMap, allPatches)
  const finalAnswers = createDerivedAnswers(answers)
  await fs.ensureDir(outputDir)
  for (const [filePath, content] of fileMap.entries()) {
    const resolvedPath = applyPathReplacements(filePath, finalAnswers)
    const fullPath = path.join(outputDir, resolvedPath)
    const finalContent = applyReplacements(content, finalAnswers)
    await fs.outputFile(fullPath, finalContent)
  }
}