import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Lipgloss TypeScript',
  description: "A comprehensive TypeScript port of Charm's Lipgloss with 100% API compatibility",
  base: '/lipgloss/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#5f7fff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Lipgloss TypeScript' }],
    ['meta', { name: 'og:image', content: 'https://tsports.github.io/lipgloss/og-image.png' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/' },
      { text: 'API Reference', link: '/api/' },
      {
        text: 'Links',
        items: [
          { text: 'GitHub', link: 'https://github.com/tsports/lipgloss' },
          { text: 'NPM', link: 'https://www.npmjs.com/package/@tsports/lipgloss' },
          { text: 'Go Lipgloss', link: 'https://github.com/charmbracelet/lipgloss' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Migrating from Go', link: '/guide/migration' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [{ text: 'Overview', link: '/examples/' }],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/tsports/lipgloss' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 tsports Team. Original Go Lipgloss by Charm.',
    },

    editLink: {
      pattern: 'https://github.com/tsports/lipgloss/edit/main/docs/:path',
    },

    search: {
      provider: 'local',
    },
  },

  vite: {
    define: {
      __DATE__: `"${new Date().toISOString()}"`,
    },
  },
});
