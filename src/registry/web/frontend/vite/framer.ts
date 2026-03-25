import type { Feature } from '@/registry/types.js'

export const framer: Feature = {
  key: 'framer',
  name: 'Framer Motion Integration',
  description: 'Adds Framer Motion for powerful animations and interactions in your Vite project.',
  templateRoot: 'web/frontend/vite/framer',
  dependencies: {
    'framer-motion': '^12.38.0'
  },
  requires: ['react'],
  patches: [
  ]
}