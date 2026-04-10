export type PromptOption = {
	label: string
	value: any
}

export type TemplatePrompt = {
	type: 'text' | 'select'
	name: string
	message: string
	initial?: string
	options?: PromptOption[]
}

export type SuccessMessageConfig = {
	title?: string
	showBase?: boolean
	showFeatures?: boolean
	installCommand?: string | null
	messages?: string[]
}

export type FilePatchOperation =
	| { type: 'replace', pattern: string | RegExp, replacement: string }
	| { type: 'insertBefore', pattern: string | RegExp, insert: string }
	| { type: 'insertAfter', pattern: string | RegExp, insert: string }
	| { type: 'remove', pattern: string | RegExp }
	| { type: 'deleteFile' }

export type FilePatch = {
	targetPath: string
	operations: FilePatchOperation[]
}

export type Feature = {
	key: string
	name: string
	description?: string
	templateRoot?: string
	patches?: FilePatch[]
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	commands?: Record<string, string>
	group?: string
	exclusive?: boolean
	additionalMessages?: string[]
	successMessage?: Partial<SuccessMessageConfig>
	requires?: string[]
}

export type BaseTemplate = {
	key: string
	name: string
	description?: string
	prompts: TemplatePrompt[]
	templateRoot: string
	usesPackageJson?: boolean
	successMessage?: SuccessMessageConfig
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	commands?: Record<string, string>
	features?: Feature[]
}

export type SubCategory = {
	key: string
	name: string
	description?: string
	templates: BaseTemplate[]
}

export type Category = {
	key: string
	name: string
	description?: string
	templates?: BaseTemplate[]
	subCategories?: SubCategory[]
}