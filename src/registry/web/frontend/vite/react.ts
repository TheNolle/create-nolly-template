import type { Feature } from '@/registry/types.js'

export const react: Feature = {
  key: 'react',
  name: 'React support',
  description: 'Adds React and Shadcn UI support',
  templateRoot: 'web/frontend/vite/react',
  devDependencies: {
    '@vitejs/plugin-react': '^6.0.1',
    '@types/node': '^20.11.1',
    '@types/react': '^19.2.14',
    '@types/react-dom': '^19.2.3'
  },
  dependencies: {
    '@fontsource-variable/figtree': '^5.2.10',
    'class-variance-authority': '^0.7.1',
    'clsx': '^2.1.1',
    'lucide-react': '^0.577.0',
    'radix-ui': '^1.4.3',
    'react': '^19.2.4',
    'react-dom': '^19.2.4',
    'react-router-dom': '^7.13.1',
    'shadcn': '^4.0.8',
    'tailwind-merge': '^3.5.0',
    'tw-animate-css': '^1.4.0'
  },
  patches: [
    {
      targetPath: 'tsconfig.app.json',
      operations: [
        {
          type: 'insertAfter',
          pattern: '"skipLibCheck": true',
          insert: ',\n\t\t"jsx": "react-jsx",\n\t\t"paths": {\n\t\t\t"@components/*": ["./src/components/*"],\n\t\t\t"@hooks/*": ["./src/hooks/*"],\n\t\t\t"@lib/*": ["./src/lib/*"]\n\t\t}\n'
        }
      ]
    },
    {
      targetPath: 'vite.config.ts',
      operations: [
        {
          type: 'insertAfter',
          pattern: 'import obfuscator from \'vite-plugin-javascript-obfuscator\'',
          insert: 'import react from \'@vitejs/plugin-react\'\nimport path from \'path\''
        },
        {
          type: 'insertBefore',
          pattern: 'tailwindcss\\(\\)',
          insert: 'react(), '
        },
        {
          type: 'insertAfter',
          pattern: 'base: \'./\',',
          insert: '\tresolve: {\n\t\talias: {\n\t\t\t\'@components\': path.resolve(__dirname, \'./src/components\'),\n\t\t\t\'@hooks\': path.resolve(__dirname, \'./src/hooks\'),\n\t\t\t\'@lib\': path.resolve(__dirname, \'./src/lib/\')\n\t\t}\n\t},'
        }
      ]
    },
    {
      targetPath: 'index.html',
      operations: [
        {
          type: 'replace',
          pattern: 'main\.ts',
          replacement: 'main.tsx'
        }
      ]
    },
    {
      targetPath: 'src/main.ts',
      operations: [ { type: 'deleteFile' } ]
    }
  ]
}