import type { Plugin } from 'vite'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { SEO } from './seo.config'

export function viteSEO(): Plugin {
  return {
    name: 'vite-seo',
    transformIndexHtml(html) {
      const meta = `
<title>${SEO.title}</title>

<meta name='description' content='${SEO.description}'>
<meta name='keywords' content='${SEO.keywords.join(', ')}'>
<meta name='author' content='${SEO.author}'>
<meta name='robots' content='index, follow'>

<link rel='canonical' href='${SEO.siteUrl}'>

<meta property='og:type' content='website'>
<meta property='og:title' content='${SEO.title}'>
<meta property='og:description' content='${SEO.description}'>
<meta property='og:url' content='${SEO.siteUrl}'>
<meta property='og:site_name' content='${SEO.siteName}'>
<meta property='og:image' content='${SEO.siteUrl}${SEO.socialImage}'>
<meta property='og:locale' content='${SEO.locale}'>

<script type='application/ld+json'>
${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': SEO.siteName,
        'url': SEO.siteUrl,
        'description': SEO.description,
        'publisher': {
          '@type': 'Person',
          'name': SEO.author
        }
      }, null, 2)}
</script>
      `
      return html.replace('</head>', `${meta}\n</head>`)
    },
    async closeBundle() {
      const sitemap = new SitemapStream({ hostname: SEO.siteUrl })
      for (const page of SEO.pages) sitemap.write({ url: `${SEO.siteUrl}${page}`, changefreq: 'weekly', priority: 0.8 })
      sitemap.end()
      const data = await streamToPromise(sitemap)
      const dist = resolve(process.cwd(), 'dist')
      mkdirSync(dist, { recursive: true })
      writeFileSync(resolve(dist, 'sitemap.xml'), data.toString())
      createRobotsTxt()
    }
  }
}

function createRobotsTxt() {
  const content = `User-agent: *
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Amazonbot
Disallow: /

Sitemap: ${SEO.siteUrl}/sitemap.xml
`

  const dist = resolve(process.cwd(), 'dist')
  mkdirSync(dist, { recursive: true })
  writeFileSync(resolve(dist, 'robots.txt'), content)
}