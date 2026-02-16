import { defineConfig } from 'vitepress'
import rawTypedocSidebar from '../api/typedoc-sidebar.json'

// Remove .md extensions from TypeDoc sidebar links
const typedocSidebar = rawTypedocSidebar.map(section => ({
  ...section,
  items: (section.items || []).map(item => ({
    ...item,
    link: item.link ? item.link.replace('.md', '') : item.link
  }))
}))

export default defineConfig({
  title: '@tsports/go-colorful',
  description: 'Complete TypeScript port of lucasb-eyer/go-colorful with 100% API compatibility',
  ignoreDeadLinks: true,
  
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
      { icon: 'github', link: 'https://github.com/SubtleTools/go-colorful-tsport' }
    ]
  }
})