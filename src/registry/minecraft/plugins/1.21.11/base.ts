import type { BaseTemplate } from '@/registry/types.js'

export const p1_21_11: BaseTemplate = {
  key: '1.21.11',
  name: 'Minecraft 1.21.11 Kotlin Plugin',
  description: 'A Kotlin plugin template for Minecraft 1.21.11 using the Purpur API.',
  prompts: [
    { type: 'text', name: 'name', message: 'Artifact ID / project slug', initial: 'my-plugin' },
    { type: 'text', name: 'displayname', message: 'Display name / main class name', initial: 'MyPlugin' },
    { type: 'text', name: 'group', message: 'Group ID / base package', initial: 'com.nolly' },
    { type: 'text', name: 'description', message: 'Project description', initial: 'A Purpur plugin built with Kotlin.' },
    { type: 'text', name: 'author', message: 'Author', initial: 'Nolly' },
    { type: 'text', name: 'url', message: 'Website URL', initial: 'https://github.com/thenolle' }
  ],
  usesPackageJson: false,
  successMessage: {
		title: '✅ Minecraft plugin created at',
		showBase: true,
		showFeatures: false,
		installCommand: 'cd {{name}} && mvn clean package',
		messages: [
			'Open the project in IntelliJ IDEA',
			'Run the Package configuration or use Maven to build the jar',
			'Copy the built jar into your test server plugins folder'
		]
	},
  templateRoot: 'minecraft/plugins/1.21.11/base',
  features: []
}