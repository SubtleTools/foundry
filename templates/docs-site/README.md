# Documentation Site Template

A comprehensive Astro/Starlight template for creating beautiful documentation sites with TypeDoc integration and advanced plugin support.

## Features

- 🚀 **Astro/Starlight** - Modern, fast documentation framework
- 📖 **TypeDoc Integration** - Automatic API documentation from TypeScript
- 🎨 **Beautiful UI** - Clean, modern design with dark mode support
- 📱 **Mobile Friendly** - Responsive design that works everywhere
- 🔍 **Advanced Search** - Built-in search with Pagefind
- 🖼️ **Image Zoom** - Click-to-zoom functionality for images
- 🔗 **Link Validation** - Automatic internal link checking
- 🤖 **AI Ready** - Generates llms.txt for AI consumption

### Optional Plugin Support

- 📋 **OpenAPI/Swagger** - Interactive API documentation
- ⌨️ **Keyboard Shortcuts** - Document keyboard shortcuts elegantly
- 🗂️ **Auto Sidebar** - Automatic sidebar generation from content
- ⬆️ **Scroll to Top** - Convenient navigation for long pages
- 📅 **Changelog** - Built-in changelog documentation
- 🪨 **Obsidian** - Publish Obsidian vaults as documentation

## Usage

### With Moon (Recommended)

```bash
# Generate with minimal configuration
moon generate docs-site my-docs -- \
  --projectName "My Project" \
  --projectDescription "My awesome project documentation"

# Generate with all features enabled
moon generate docs-site my-api-docs -- \
  --projectName "My API" \
  --projectDescription "Comprehensive API documentation" \
  --enableOpenAPI \
  --enableKeyboardShortcuts \
  --enableScrollToTop \
  --enableChangelogs \
  --docsFolder "documentation"
```

### Configuration Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `docsFolder` | string | `"docs"` | Documentation folder name |
| `projectName` | string | required | Project name for titles |
| `projectDescription` | string | required | Project description |
| `siteUrl` | string | `"https://localhost:4321"` | Production site URL |
| `githubRepo` | string | optional | GitHub repository URL |
| `enableTypedoc` | boolean | `true` | Enable TypeDoc API documentation |
| `entryPoint` | string | `"src/index.ts"` | TypeScript entry point |
| `enableOpenAPI` | boolean | `false` | Enable OpenAPI/Swagger docs |
| `enableKeyboardShortcuts` | boolean | `false` | Enable keyboard shortcuts docs |
| `enableAutoSidebar` | boolean | `false` | Enable automatic sidebar generation |
| `enableScrollToTop` | boolean | `true` | Enable scroll-to-top button |
| `enableChangelogs` | boolean | `false` | Enable changelog documentation |
| `enableObsidian` | boolean | `false` | Enable Obsidian integration |

## Generated Structure

```
project/
├── docs/                    # Documentation folder (configurable)
│   ├── content/
│   │   ├── config.ts       # Content collections configuration
│   │   └── docs/           # Documentation pages
│   │       ├── index.mdx   # Homepage with hero section
│   │       ├── introduction.mdx
│   │       ├── installation.mdx
│   │       ├── quick-start.mdx
│   │       └── features/
│   │           └── core.mdx
│   └── public/             # Static assets
├── astro.config.mjs        # Astro configuration with plugins
├── package.json           # Dependencies based on enabled features
├── tailwind.config.mjs    # Styling configuration
├── openapi.yaml           # OpenAPI spec (if enabled)
└── README.md              # Documentation site README
```

## Development Workflow

After generating a documentation site:

```bash
cd my-docs

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Plugin Details

### Core Plugins (Always Included)
- **starlight-image-zoom** - Click-to-zoom images
- **starlight-links-validator** - Build-time link validation
- **starlight-llms-txt** - AI-friendly content generation
- **astro-d2** - Diagram rendering support

### Conditional Plugins
- **starlight-typedoc** - API documentation from TypeScript
- **starlight-openapi** - Interactive OpenAPI/Swagger documentation
- **starlight-kbd** - Keyboard shortcut documentation
- **starlight-auto-sidebar** - Automatic sidebar from file structure
- **starlight-scroll-to-top** - Scroll-to-top button
- **starlight-changelogs** - Changelog page generation
- **starlight-obsidian** - Obsidian vault publishing
- **starlight-sidebar-topics** - Manual sidebar organization (when auto-sidebar disabled)

## Examples

### Basic Documentation Site
```bash
moon generate docs-site basic-docs -- \
  --projectName "Basic Docs" \
  --projectDescription "Simple documentation site"
```

### API Documentation with OpenAPI
```bash
moon generate docs-site api-docs -- \
  --projectName "My API" \
  --projectDescription "REST API documentation" \
  --enableOpenAPI \
  --enableKeyboardShortcuts \
  --siteUrl "https://api.example.com"
```

### Auto-Generated Sidebar
```bash
moon generate docs-site auto-docs -- \
  --projectName "Auto Docs" \
  --projectDescription "Documentation with automatic navigation" \
  --enableAutoSidebar \
  --enableScrollToTop
```

## Requirements

- Node.js 18+
- Bun (recommended) or npm/yarn/pnpm
- Moon workspace (for generation)

## License

MIT - Use this template freely for any project.

## Contributing

This template is part of the TSports ecosystem. Contributions welcome via GitHub issues and pull requests.