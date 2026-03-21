export function App(): React.ReactElement | null {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center space-y-3'>
        <h1 className='text-4xl font-bold tracking-tight text-gray-900'>Welcome to your {{name}} App</h1>
        <h2 className='text-2xl font-semibold tracking-tight text-gray-900'>Vite + React + TypeScript + Tailwind + Shadcn UI</h2>
        <p className='text-gray-500 text-sm'>
          Edit{' '}
          <code className='bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-700'>src/App.tsx</code>
          {' '}to get started
        </p>
        <div className='flex justify-center space-x-4 mt-4'>
          <a className='text-sm text-blue-600 hover:underline' href='https://vitejs.dev/guide/features.html' target='_blank'>Learn more about Vite</a>
          <a className='text-sm text-blue-600 hover:underline ml-4' href='https://react.dev/learn' target='_blank'>Learn more about React</a>
          <a className='text-sm text-blue-600 hover:underline ml-4' href='https://www.typescriptlang.org/docs/' target='_blank'>Learn more about TypeScript</a>
          <a className='text-sm text-blue-600 hover:underline ml-4' href='https://tailwindcss.com/docs' target='_blank'>Learn more about Tailwind</a>
          <a className='text-sm text-blue-600 hover:underline ml-4' href='https://ui.shadcn.com/docs' target='_blank'>Learn more about Shadcn UI</a>
        </div>
        <footer className='text-center text-gray-500 text-sm mt-8'>
          Made with{' '}
          <a href='https://npmjs.com/create-nolly-template' className='text-rose-600 hover:underline' target='_blank'>
            <code className='bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-700'>Nolly's Template</code>
          </a>{' '}
          by{' '}
          <a href='https://thenolle.com' className='text-pink-600 hover:underline' target='_blank'>Nolly</a>
        </footer>
      </div>
    </div>
  )
}