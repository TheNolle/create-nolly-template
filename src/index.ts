#!/usr/bin/env node
import Enquirer from 'enquirer'
import { registry } from './registry/index.js'
import { buildProject } from './builder.js'
import packageJSON from '../package.json' with { type: 'json' }
import { BaseTemplate, Category, Feature } from './registry/types.js'
import chalk from 'chalk'

const { Select, MultiSelect, Input } = Enquirer as any

async function printHelp() {
  console.log(chalk.bold.cyan(`\n🚀 create-nolly-template v${packageJSON.version}\n`))
  console.log(chalk.white(`${packageJSON.description}\n`))
  console.log(chalk.bold('💡 Usage:'))
  console.log(chalk.white(`  ${chalk.green('create-nolly-template')}          Interactive wizard`))
  console.log(chalk.white(`  ${chalk.green('create-nolly-template --help')}   Show this help`))
  console.log(chalk.white(`  ${chalk.green('create-nolly-template --about')}  About & credits`))
  console.log(chalk.white(`  ${chalk.green('create-nolly-template --list')}   List all templates\n`))
  console.log(chalk.bold('📌 Examples:'))
  console.log(chalk.white(`  ${chalk.green('pnpx create-nolly-template')}`))
  console.log(chalk.white(`  ${chalk.green('create-nolly-template -l')}\n`))
  console.log(chalk.gray('Run without args to start the interactive wizard.\n'))
  process.exit(0)
}

async function printAbout() {
  console.log(chalk.bold.cyan(`\n🚀 create-nolly-template v${packageJSON.version}\n`))
  console.log(chalk.white(`${packageJSON.description}\n`))
  console.log(chalk.bold.yellow('✨ Features & Philosophy'))
  console.log(chalk.green('  • Zero-config templates'))
  console.log(chalk.green('  • TypeScript-first, ESM-ready'))
  console.log(chalk.green('  • Supports Fastify, WebSocket, Swagger, MongoDB, Prisma, and more\n'))
  console.log(chalk.bold.yellow('🛠 Built with'))
  console.log(chalk.cyan('  • TypeScript'))
  console.log(chalk.cyan('  • fs-extra'))
  console.log(chalk.cyan('  • Enquirer prompts'))
  console.log(chalk.cyan('  • ❤️  Passion for developer experience\n'))
  console.log(chalk.bold.yellow('👤 Author'))
  console.log(chalk.white(`  Nolly - full-stack developer & open-source enthusiast`))
  console.log(chalk.white(`  GitHub: ${chalk.blue(`https://github.com/thenolle/${packageJSON.name}`)}`))
  console.log(chalk.white(`  License: ${chalk.magenta(packageJSON.license)}\n`))
  console.log(chalk.gray('Run without args to start the interactive wizard.\n'))
  process.exit(0)
}

function printList() {
  console.log(chalk.bold.cyan(`🚀 Nolly Templates CLI\nExplore available templates and optional features\n`))
  function printFeature(feature: Feature, featureMap: Map<string, Feature>, printed = new Set<string>(), indentLevel = 2, isDependency = false) {
    if (printed.has(feature.key)) return
    printed.add(feature.key)
    const meta: string[] = []
    if (feature.group) meta.push(`group: ${feature.group}${feature.exclusive ? ' (exclusive)' : ''}`)
    if (feature.requires?.length) meta.push(`requires: ${feature.requires.join(', ')}`)
    const metaStr = meta.length ? chalk.gray(` [${meta.join(' | ')}]`) : ''
    const indentStr = ' '.repeat(indentLevel * 2)
    const symbol = isDependency ? chalk.magenta('↳') : chalk.green('•')
    const nameColor = isDependency ? chalk.magenta.bold : chalk.green.bold
    console.log(`${indentStr}${symbol} ${nameColor(feature.name)} (${chalk.yellow(feature.key)})${metaStr}`)
    if (!isDependency && feature.description) console.log(`${indentStr}  ${chalk.gray(feature.description)}`)
    if (feature.requires) {
      feature.requires.forEach(reqKey => {
        const reqFeature = featureMap.get(reqKey)
        if (reqFeature) {
          printFeature(reqFeature, featureMap, printed, indentLevel + 1, true)
        }
      })
    }
  }
  function printTemplate(template: BaseTemplate, indentLevel = 1) {
    const indentStr = ' '.repeat(indentLevel * 2)
    console.log(`${indentStr}${chalk.blue('▸')} ${chalk.bold.blue(template.name)} (${chalk.yellow(template.key)})`)
    if (template.description) console.log(`${indentStr}  ${chalk.gray(template.description)}`)
    const featureMap = new Map<string, Feature>()
    template.features?.forEach(f => featureMap.set(f.key, f))
    template.features?.forEach(f => printFeature(f, featureMap, new Set(), indentLevel + 1))
    console.log('')
  }
  function printCategory(category: Category) {
    console.log(chalk.bold.cyan(`${category.name} (${category.key})`))
    category.templates?.forEach(t => printTemplate(t, 1))
    category.subCategories?.forEach(sub => {
      const indentStr = ' '.repeat(2)
      console.log(`${indentStr}${chalk.cyan(sub.name)} (${chalk.yellow(sub.key)})`)
      sub.templates.forEach(t => printTemplate(t, 2))
    })
  }
  registry.forEach(printCategory)
  console.log(chalk.gray('\nRun without args to start the interactive wizard.\n'))
  console.log(`${chalk.bold.cyan('Category')} | ${chalk.cyan('Subcategory')} | ${chalk.bold.blue('Template')} | ${chalk.green('Feature')} | ${chalk.magenta('Dependency')} | ${chalk.yellow('Key')}`)
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