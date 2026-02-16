import { defineConfig } from 'vitepress'
import rawTypedocSidebar from '../api/typedoc-sidebar.json'

// Remove .md extensions from TypeDoc sidebar links
const typedocSidebar = rawTypedocSidebar.map(section => ({
  ...section,
  items: section.items.map(item => ({
    ...item,
    link: item.link.replace('.md', '')
  }))
}))

export default defineConfig({
  title: '@tsports/go-osc52',
  description: 'OSC52 terminal clipboard escape sequences - TypeScript port of go-osc52',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Examples', link: '/guide/examples' }
          ]
        }
      ],
      '/api/': [
        { text: 'Overview', link: '/api/' },
        ...typedocSidebar
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tsports/go-osc52' }
    ]
  }
})
