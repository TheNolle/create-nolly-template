#!/usr/bin/env node
import prompts from 'prompts'
import { registry } from './registry/index.js'
import { buildProject } from './builder.js'
import packageJSON from '../package.json' with { type: 'json' }

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
    for (const sub of category.subCategories) {
      console.log(`│  ├─ ${sub.name} (${sub.key})`)
      console.log('│  │')
      for (const template of sub.templates) {
        console.log(`│  │  ├─ ${template.name} (${template.key})`)
        if (template.features?.length) {
          console.log(`│  │  │  Features:`)
          template.features.forEach(feat =>
            console.log(`│  │  │    • ${feat.name} - ${feat.description}`)
          )
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
  const { category } = await prompts({
    type: 'select',
    name: 'category',
    message: 'Main category',
    choices: registry.map(category => ({ title: category.name, value: category }))
  }) as { category: typeof registry[0] }
  const { subCategory } = await prompts({
    type: 'select',
    name: 'subCategory',
    message: 'Sub category',
    choices: category.subCategories.map(subCategory => ({ title: subCategory.name, value: subCategory }))
  }) as { subCategory: typeof category.subCategories[0] }
  if (!subCategory) process.exit(0)
  const { template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'Base template',
    choices: subCategory.templates.map(template => ({ title: template.name, value: template }))
  }) as { template: typeof subCategory.templates[0] }
  if (!template) process.exit(0)
  let selectedFeatures: any[] = []
  if (template.features && template.features.length > 0) {
    const { features } = await prompts({
      type: 'multiselect',
      name: 'features',
      message: 'Optional features (space to toggle)',
      choices: template.features.map((feature: any) => ({
        title: feature.name,
        value: feature,
        description: feature.description
      })),
      hint: '- Space to select. Return to submit'
    }) as { features: any[] }
    selectedFeatures = features ?? []
  }
  const answers = await prompts(template.prompts)
  const { outputDir } = await prompts({
    type: 'text',
    name: 'outputDir',
    message: 'Output directory',
    initial: `./${answers.name || template.key}`
  }) as { outputDir: string }
  if (!outputDir) process.exit(0)
  await buildProject(template, selectedFeatures, answers, outputDir)
  console.log('\n✅ Project created at', outputDir)
  console.log('   Base:', template.name)
  if (selectedFeatures.length > 0) console.log('   Features:', selectedFeatures.map((feature: any) => feature.name).join(', '))
  console.log('\n   cd', outputDir, '&& pnpm install\n')
}

main().catch(error => {
  console.error('Error:', error)
  process.exit(1)
})