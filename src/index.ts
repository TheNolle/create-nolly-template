#!/usr/bin/env node
import Enquirer from 'enquirer'
import { registry } from './registry/index.js'
import { buildProject } from './builder.js'
import packageJSON from '../package.json' with { type: 'json' }
import { BaseTemplate, Feature } from './registry/types.js'

const { Select, MultiSelect, Input } = Enquirer as any

async function printHelp() {
  console.log(`
🚀 create-nolly-template v${packageJSON.version}

${packageJSON.description}

Usage:
  create-nolly-template          Interactive wizard
  create-nolly-template --help   This help
  create-nolly-template --about  About & credits
  create-nolly-template --list   List all templates

Examples:
  pnpx create-nolly-template
  create-nolly-template -l
  `)
  process.exit(0)
}

async function printAbout() {
  console.log(`
🚀 create-nolly-template v${packageJSON.version}

${packageJSON.description}

Nolly's templates. Zero-config, TypeScript-first.

Templates: Fastify, WebSocket, Swagger, MongoDB, Prisma, and even more !
Built with: TypeScript, ESM, fs-extra, prompts, and a lot of ❤️

Made by Nolly, a passionate full-stack developer and open-source enthusiast.
GitHub: thenolle/${packageJSON.name}
License: ${packageJSON.license}
`)
  process.exit(0)
}

async function printList() {
  console.log('\n📋 Available Templates & Features\n')
  for (const category of registry) {
    console.log(`┌─ ${category.name} (${category.key})`)
    console.log('│')
    if (category.templates) {
      for (const template of category.templates) {
        console.log(`│  ├─ ${template.name} (${template.key})`)
      }
    }
    if (category.subCategories) {
      for (const sub of category.subCategories) {
        console.log(`│  ├─ ${sub.name} (${sub.key})`)
        console.log('│  │')
        for (const template of sub.templates) {
          console.log(`│  │  ├─ ${template.name} (${template.key})`)
        }
        console.log('│  │')
      }
    }
    console.log('│')
  }
  console.log('Run without args for interactive mode.\n')
  process.exit(0)
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) return printHelp()
  if (args.includes('--about') || args.includes('-a')) return printAbout()
  if (args.includes('--list') || args.includes('-l')) return printList()
  console.log('\n🚀 Welcome to create-nolly-template!\n')
  const category = await new Select({
    name: 'category',
    message: 'Main category',
    choices: registry.map(c => c.name),
    result(name: string) { return registry.find(c => c.name === name) }
  }).run()
  let template: BaseTemplate | undefined
  const hasTemplates = category.templates && category.templates.length > 0
  const hasSubs = category.subCategories && category.subCategories.length > 0
  if (hasTemplates && hasSubs) {
    const allTemplates = [
      ...category.templates!,
      ...category.subCategories!.flatMap((s: any) => s.templates)
    ]
    template = await new Select({
      name: 'template',
      message: 'Base template',
      choices: allTemplates.map((t: any) => t.name),
      result(name: string) {
        return allTemplates.find((t: any) => t.name === name)
      }
    }).run()
  } else if (hasTemplates) {
    if (category.templates!.length === 1) {
      const selectedTemplate = category.templates![0]
      template = selectedTemplate
      console.log(`\n⚡ Auto-selected template: ${selectedTemplate.name}\n`)
    } else {
      template = await new Select({
        name: 'template',
        message: 'Base template',
        choices: category.templates!.map((t: any) => t.name),
        result(name: string) {
          return category.templates!.find((t: any) => t.name === name)
        }
      }).run()
    }
  } else if (hasSubs) {
    const subCategory = await new Select({
      name: 'subCategory',
      message: 'Sub category',
      choices: category.subCategories!.map((s: any) => s.name),
      result(name: string) {
        return category.subCategories!.find((s: any) => s.name === name)
      }
    }).run()
    if (subCategory.templates.length === 1) {
      const selectedTemplate = subCategory.templates[0]
      template = selectedTemplate
      console.log(`\n⚡ Auto-selected template: ${selectedTemplate.name}\n`)
    } else {
      template = await new Select({
        name: 'template',
        message: 'Base template',
        choices: subCategory.templates.map((t: any) => t.name),
        result(name: string) {
          return subCategory.templates.find((t: any) => t.name === name)
        }
      }).run()
    }
  }
  if (!template) {
    throw new Error(`No templates found for category "${category.name}"`)
  }
  const finalTemplate = template
  function resolveFeatureDependencies(templateFeatures: Feature[], initialSelection: Feature[]): Feature[] {
    const selectedMap = new Map<string, Feature>()
    const featureMap = new Map(templateFeatures.map(f => [f.key, f]))
    const addFeature = (feat: Feature) => {
      if (selectedMap.has(feat.key)) return
      selectedMap.set(feat.key, feat)
      if (feat.requires) {
        for (const reqKey of feat.requires) {
          const reqFeat = featureMap.get(reqKey)
          if (!reqFeat) throw new Error(`Feature "${feat.name}" requires unknown feature "${reqKey}"`)
          addFeature(reqFeat)
        }
      }
    }
    for (const feat of initialSelection) addFeature(feat)
    return Array.from(selectedMap.values())
  }
  let selectedFeatures: Feature[] = []
  if (finalTemplate.features && finalTemplate.features.length > 0) {
    const features = finalTemplate.features!
    const featureMap = new Map(features.map((f: Feature) => [f.key, f]))
    const prompt = new MultiSelect({
      name: 'features',
      message: 'Optional features (space to toggle)',
      hint: 'Space to select · Enter to submit',
      choices: features.map((f: Feature) => ({
        name: f.key,
        message: f.name,
        hint: f.requires?.length ? `${f.description ?? ''} (requires: ${f.requires.join(', ')})` : f.description
      })),
      result(names: string[]) {
        return names.map(name => features.find((f: Feature) => f.key === name))
      }
    })
    function collectDependencies(feat: Feature, acc = new Set<string>()) {
      if (!feat.requires) return acc
      for (const key of feat.requires) {
        if (acc.has(key)) continue
        acc.add(key)
        const dep = featureMap.get(key) as Feature | undefined
        if (dep) collectDependencies(dep, acc)
      }
      return acc
    }
    prompt.on('toggle', (choice: any, enabled: boolean) => {
      if (!enabled) return
      const feat = featureMap.get(choice.name) as Feature | undefined
      if (!feat) return
      const deps = collectDependencies(feat)
      for (const depKey of deps) {
        const depChoice = prompt.choices.find((c: any) => c.name === depKey)
        if (depChoice && !depChoice.enabled) {
          prompt.enable(depChoice)
        }
      }
    })
    const selected = await prompt.run() as Feature[]
    selectedFeatures = resolveFeatureDependencies(features, selected)
    const selectedKeys = new Set(selected.map(f => f.key))
    const autoAdded = selectedFeatures.filter(f => !selectedKeys.has(f.key))
    if (autoAdded.length > 0) {
      console.log('\nThe following features were automatically selected because they are required:')
      autoAdded.forEach(f => console.log(`  • ${f.name}`))
    }
    const groups = new Map<string, string>()
    for (const feat of selectedFeatures) {
      if (feat.group && feat.exclusive) {
        if (groups.has(feat.group)) {
          const conflictingKey = groups.get(feat.group)
          const conflicting = selectedFeatures.find(f => f.key === conflictingKey)
          if (!conflicting) continue
          throw new Error(
            `Feature "${feat.name}" conflicts with "${conflicting?.name}" in group "${feat.group}".` +
            ` This may be caused by an automatic dependency.`
          )
        }
        groups.set(feat.group, feat.key)
      }
    }
  }
  const answers: Record<string, string> = {}
  for (const prompt of finalTemplate.prompts) {
    const value = await new Input({
      name: prompt.name,
      message: prompt.message,
      initial: prompt.initial
    }).run()
    answers[prompt.name] = value
  }
  const outputDir = await new Input({
    name: 'outputDir',
    message: 'Output directory',
    initial: `./${answers.name || finalTemplate.key}`
  }).run()
  if (!outputDir) process.exit(0)
  await buildProject(template, selectedFeatures, answers, outputDir)
  console.log('\n✅ Project created at', outputDir)
  console.log('   Base:', finalTemplate.name)
  if (selectedFeatures.length > 0) console.log('   Features:', selectedFeatures.map(f => f.name).join(', '))
  for (const feature of selectedFeatures) {
    if (feature.additionalMessages && feature.additionalMessages.length > 0) {
      console.log(`\n📌 ${feature.name} - ${feature.description}`)
      feature.additionalMessages.forEach((msg: string) => console.log(`   • ${msg}`))
    }
  }
  console.log('\n   cd', outputDir, '&& pnpm install\n')
}

main().catch(error => {
  console.error('Error:', error)
  process.exit(1)
})