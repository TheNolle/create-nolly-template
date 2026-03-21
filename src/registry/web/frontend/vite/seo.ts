import type { Feature } from '@/registry/types.js'

export const seo: Feature = {
  key: 'seo',
  name: 'SEO optimization',
  description: 'Adds a custom SEO vite plugin to optimize your app for search engines and social media sharing',
  templateRoot: 'web/frontend/vite/seo',
  dependencies: {
    'sitemap': '^9.0.1',
  },
  patches: [
    {
      targetPath: 'index.html',
      operations: [
        {
          type: 'remove',
          pattern: /<title>.*<\/title>/,
        },
        {
          type: 'remove',
          pattern: /<meta name='description' content='.*'>/,
        }
      ]
    },
    {
      targetPath: 'vite.config.ts',
      operations: [
        {
          type: 'insertAfter',
          pattern: 'import obfuscator from \'vite-plugin-javascript-obfuscator\'',
          insert: 'import { viteSEO } from \'./vite-plugin-seo\''
        },
        {
          type: 'insertBefore',
          pattern: 'tailwindcss\\(\\)',
          insert: 'viteSEO(), '
        }
      ]
    }
  ]
}