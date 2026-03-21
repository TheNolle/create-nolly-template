import './globals.css'

const container = document.createElement('div')
container.classList.add('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')
document.body.appendChild(container)

const content = document.createElement('div')
content.classList.add('text-center', 'space-y-3')
container.appendChild(content)

const heading = document.createElement('h1')
heading.classList.add('text-6xl', 'font-extrabold', 'tracking-tight', 'text-gray-900')
heading.textContent = 'Welcome to your {{name}} App'
content.appendChild(heading)

const subHeading = document.createElement('h2')
subHeading.classList.add('text-4xl', 'font-bold', 'tracking-tight', 'text-gray-900')
subHeading.textContent = 'Vite + TypeScript + Tailwind'
content.appendChild(subHeading)

const paragraph = document.createElement('p')
paragraph.classList.add('text-gray-500', 'text-sm')
paragraph.innerHTML = `Edit <code class='bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-700'>src/main.ts</code> to get started`
content.appendChild(paragraph)

const links = document.createElement('div')
links.classList.add('flex', 'justify-center', 'space-x-4', 'mt-4')
content.appendChild(links)

const viteLink = document.createElement('a')
viteLink.classList.add('text-sm', 'text-blue-600', 'hover:underline')
viteLink.href = 'https://vitejs.dev/guide/features.html'
viteLink.target = '_blank'
viteLink.textContent = 'Learn more about Vite'
links.appendChild(viteLink)

const tailwindLink = document.createElement('a')
tailwindLink.classList.add('text-sm', 'text-blue-600', 'hover:underline', 'ml-4')
tailwindLink.href = 'https://tailwindcss.com/docs'
tailwindLink.target = '_blank'
tailwindLink.textContent = 'Learn more about Tailwind'
links.appendChild(tailwindLink)

const tsLink = document.createElement('a')
tsLink.classList.add('text-sm', 'text-blue-600', 'hover:underline', 'ml-4')
tsLink.href = 'https://www.typescriptlang.org/docs/'
tsLink.target = '_blank'
tsLink.textContent = 'Learn more about TypeScript'
links.appendChild(tsLink)

const footer = document.createElement('footer')
footer.classList.add('text-center', 'text-gray-500', 'text-sm', 'mt-8')
footer.innerHTML = `Made with <a href='https://npmjs.com/create-nolly-template' class='text-rose-600 hover:underline' target='_blank'><code class='bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-700'>Nolly's Template</code></a> by <a href='https://thenolle.com' class='text-pink-600 hover:underline' target='_blank'>Nolly</a>`
content.appendChild(footer)