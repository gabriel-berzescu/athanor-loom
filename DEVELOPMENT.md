# Development Guide

Complete guide for developers working on Athanor Loom.

## Prerequisites

- **Node.js** 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)
- Git
- OpenRouter API key for testing

## Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/athanor-loom.git
cd athanor-loom

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to localhost:5173 (or shown URL)
```

## Tech Stack

### Core Framework
**Recommendation**: Svelte or React

**Svelte** (recommended):
- Simpler syntax
- Smaller bundle size
- Built-in reactivity
- Great for this use case

**React**:
- Larger ecosystem
- More familiar to many devs
- Excellent tooling

### Build Tool
**Vite** - Fast, modern, excellent DX

### Visualization
**Cytoscape.js** - Interactive graph/tree visualization

Alternatives:
- D3.js (more control, steeper curve)
- vis.js (simpler, less flexible)

### Styling
**Tailwind CSS** - Utility-first CSS framework

Benefits:
- Rapid development
- Consistent design
- Dark mode support built-in
- Small production bundle

### State Management
- **Svelte**: Built-in stores
- **React**: Zustand or Redux Toolkit

### Additional Libraries
- **uuid**: Generate node IDs
- **date-fns**: Date formatting
- **clsx**: Conditional class names

## Project Structure

```
athanor-loom/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── App.svelte (or .jsx)
│   │   ├── Toolbar.svelte
│   │   ├── SettingsDrawer.svelte
│   │   ├── LeftPanel.svelte
│   │   ├── RightPanel.svelte
│   │   └── TreeCanvas.svelte
│   ├── lib/
│   │   ├── tree.js           # Tree data structure & operations
│   │   ├── api.js            # OpenRouter client
│   │   ├── storage.js        # File save/load
│   │   ├── layout.js         # Tree layout algorithms
│   │   └── validation.js     # Tree validation
│   ├── stores/
│   │   ├── treeStore.js      # Tree state
│   │   ├── uiStore.js        # UI state
│   │   └── settingsStore.js  # Settings state
│   ├── styles/
│   │   └── main.css          # Global styles
│   ├── utils/
│   │   ├── constants.js      # Constants
│   │   └── helpers.js        # Helper functions
│   ├── main.js               # Entry point
│   └── App.svelte (or .jsx)
├── tests/
│   ├── unit/
│   │   ├── tree.test.js
│   │   ├── api.test.js
│   │   └── validation.test.js
│   └── e2e/
│       └── app.spec.js
├── docs/
│   ├── README.md
│   ├── CONCEPTS.md
│   ├── USER_GUIDE.md
│   ├── ARCHITECTURE.md
│   ├── API_INTEGRATION.md
│   ├── FILE_FORMAT.md
│   └── DEVELOPMENT.md
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── LICENSE
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

**Key dependencies**:
```json
{
  "dependencies": {
    "svelte": "^4.0.0",
    "cytoscape": "^3.26.0",
    "uuid": "^9.0.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "vitest": "^1.0.0",
    "playwright": "^1.40.0"
  }
}
```

### 2. Configure Vite

**vite.config.js**:
```javascript
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### 3. Configure Tailwind

**tailwind.config.js**:
```javascript
export default {
  content: [
    './index.html',
    './src/**/*.{svelte,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'loom-bg': '#1a1a1a',
        'loom-panel': '#2a2a2a',
        'loom-border': '#3a3a3a',
        'loom-text': '#e0e0e0',
        'loom-accent': '#4a9eff'
      }
    }
  },
  plugins: []
};
```

### 4. Environment Variables

Create `.env.local`:
```
VITE_DEFAULT_MODEL=meta-llama/llama-3.1-8b-instruct
VITE_OPENROUTER_URL=https://openrouter.ai/api/v1
```

**Don't commit API keys!** Add to `.gitignore`:
```
.env.local
.env*.local
```

## Development Workflow

### Running Development Server

```bash
npm run dev
```

- Hot module reload enabled
- Opens browser automatically
- Changes reflect immediately

### Building for Production

```bash
npm run build
```

Outputs to `dist/`:
- Minified JS and CSS
- Optimized assets
- Ready to deploy

### Preview Production Build

```bash
npm run preview
```

Test the production build locally.

## Code Style

### ESLint

**.eslintrc.json**:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:svelte/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "es2022": true
  }
}
```

Run linter:
```bash
npm run lint
```

### Prettier

**.prettierrc**:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte"]
}
```

Format code:
```bash
npm run format
```

### Conventions

- **File names**: kebab-case (`tree-canvas.svelte`)
- **Component names**: PascalCase (`TreeCanvas`)
- **Function names**: camelCase (`generateNode`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TEMPERATURE`)
- **2 spaces** for indentation
- **Semicolons**: yes
- **Quotes**: single quotes for JS, double for HTML attributes

## Core Modules

### Tree Module (`lib/tree.js`)

Tree data structure and operations:

```javascript
export class Tree {
  constructor() {
    this.nodes = new Map();
    this.root = null;
  }

  addNode(node) {
    this.nodes.set(node.id, node);
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  getPath(nodeId) {
    const path = [];
    let current = this.getNode(nodeId);

    while (current) {
      path.unshift(current);
      current = current.parent ? this.getNode(current.parent) : null;
    }

    return path;
  }

  deleteNode(nodeId) {
    // Implementation
  }

  serialize() {
    // Convert to JSON format
  }

  static deserialize(json) {
    // Convert from JSON format
  }
}
```

### API Client (`lib/api.js`)

OpenRouter integration:

```javascript
export class OpenRouterClient {
  constructor(apiKey, modelName) {
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.baseUrl = 'https://openrouter.ai/api/v1';
  }

  async generateCompletion(promptText, params) {
    // Implementation from API_INTEGRATION.md
  }

  async generateMultiple(promptText, count, params) {
    // Implementation from API_INTEGRATION.md
  }
}
```

### Storage Module (`lib/storage.js`)

File save/load:

```javascript
export async function saveTree(tree, filename) {
  // Implementation from FILE_FORMAT.md
}

export async function loadTree() {
  // Implementation from FILE_FORMAT.md
}

export function saveSettings(settings) {
  localStorage.setItem('loom-settings', JSON.stringify(settings));
}

export function loadSettings() {
  const json = localStorage.getItem('loom-settings');
  return json ? JSON.parse(json) : getDefaultSettings();
}
```

## State Management

### Tree Store (Svelte)

**stores/treeStore.js**:
```javascript
import { writable, derived } from 'svelte/store';
import { Tree } from '../lib/tree';

export const tree = writable(new Tree());
export const selectedNodeId = writable(null);

export const selectedNode = derived(
  [tree, selectedNodeId],
  ([$tree, $selectedNodeId]) => {
    return $selectedNodeId ? $tree.getNode($selectedNodeId) : null;
  }
);

export const selectedPath = derived(
  [tree, selectedNodeId],
  ([$tree, $selectedNodeId]) => {
    return $selectedNodeId ? $tree.getPath($selectedNodeId) : [];
  }
);
```

### UI Store

**stores/uiStore.js**:
```javascript
import { writable } from 'svelte/store';

export const drawerOpen = writable(false);
export const searchTerm = writable('');
export const loadingNodes = writable([]);
export const zoom = writable(1.0);
export const panOffset = writable({ x: 0, y: 0 });
```

### Settings Store

**stores/settingsStore.js**:
```javascript
import { writable } from 'svelte/store';
import { loadSettings, saveSettings } from '../lib/storage';

const defaultSettings = {
  api: {
    apiKey: '',
    modelName: 'meta-llama/llama-3.1-8b-instruct'
  },
  generation: {
    temperature: 0.7,
    maxTokens: 256,
    topP: 0.9,
    topK: 40,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0
  },
  interface: {
    defaultGenerationCount: 3,
    darkMode: true
  }
};

const settings = writable(loadSettings() || defaultSettings);

// Auto-save on changes
settings.subscribe(value => {
  saveSettings(value);
});

export { settings };
```

## Testing

### Unit Tests

**Vitest** for unit tests.

**tests/unit/tree.test.js**:
```javascript
import { describe, it, expect } from 'vitest';
import { Tree } from '../../src/lib/tree';

describe('Tree', () => {
  it('should create empty tree', () => {
    const tree = new Tree();
    expect(tree.nodes.size).toBe(0);
    expect(tree.root).toBe(null);
  });

  it('should add node', () => {
    const tree = new Tree();
    const node = { id: 'node-1', text: 'Hello', parent: null, children: [] };
    tree.addNode(node);
    expect(tree.nodes.size).toBe(1);
    expect(tree.getNode('node-1')).toBe(node);
  });

  it('should compute path', () => {
    const tree = new Tree();
    const root = { id: 'root', text: 'Root', parent: null, children: ['child-1'] };
    const child = { id: 'child-1', text: 'Child', parent: 'root', children: [] };
    tree.addNode(root);
    tree.addNode(child);
    tree.root = 'root';

    const path = tree.getPath('child-1');
    expect(path).toHaveLength(2);
    expect(path[0]).toBe(root);
    expect(path[1]).toBe(child);
  });
});
```

Run tests:
```bash
npm test
```

### E2E Tests

**Playwright** for end-to-end tests.

**tests/e2e/app.spec.js**:
```javascript
import { test, expect } from '@playwright/test';

test('should load app', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.locator('h1')).toHaveText('Athanor Loom');
});

test('should generate nodes', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Enter API key in settings
  await page.click('[data-testid="settings-button"]');
  await page.fill('[data-testid="api-key-input"]', 'test-key');
  await page.click('[data-testid="settings-close"]');

  // Enter root text
  await page.fill('[data-testid="root-input"]', 'Once upon a time');

  // Generate
  await page.click('[data-testid="generate-3-button"]');

  // Wait for loading
  await page.waitForSelector('[data-testid="node"]', { timeout: 10000 });

  // Should have 4 nodes (root + 3 children)
  const nodes = await page.locator('[data-testid="node"]').count();
  expect(nodes).toBe(4);
});
```

Run E2E tests:
```bash
npm run test:e2e
```

## Component Development

### Example Component (Svelte)

**components/Toolbar.svelte**:
```svelte
<script>
  import { drawerOpen } from '../stores/uiStore';
  import { generateMultiple } from '../lib/api';
  import { tree, selectedNodeId } from '../stores/treeStore';

  export let onGenerate;

  function openSettings() {
    drawerOpen.set(true);
  }

  async function handleGenerate(count) {
    await onGenerate(count);
  }
</script>

<div class="toolbar">
  <button on:click={openSettings} data-testid="settings-button">
    Settings
  </button>

  <button on:click={() => handleGenerate(3)} data-testid="generate-3-button">
    Generate 3
  </button>

  <button on:click={() => handleGenerate(5)}>
    Generate 5
  </button>

  <button on:click={() => handleGenerate(7)}>
    Generate 7
  </button>

  <input type="search" placeholder="Search..." data-testid="search-input" />
</div>

<style>
  .toolbar {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: var(--loom-panel);
    border-bottom: 1px solid var(--loom-border);
  }

  button {
    padding: 0.5rem 1rem;
    background: var(--loom-accent);
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.9;
  }
</style>
```

## Tree Visualization

### Cytoscape.js Integration

**components/TreeCanvas.svelte**:
```svelte
<script>
  import { onMount } from 'svelte';
  import cytoscape from 'cytoscape';
  import { tree, selectedNodeId } from '../stores/treeStore';

  let container;
  let cy;

  onMount(() => {
    cy = cytoscape({
      container: container,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#4a9eff',
            'label': 'data(label)',
            'text-valign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#1a1a1a'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#3a3a3a',
            'curve-style': 'bezier'
          }
        },
        {
          selector: '.selected',
          style: {
            'background-color': '#ff6b6b',
            'border-width': 3,
            'border-color': '#fff'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        spacingFactor: 1.5,
        avoidOverlap: true
      }
    });

    cy.on('tap', 'node', (event) => {
      const nodeId = event.target.id();
      selectedNodeId.set(nodeId);
    });
  });

  // Update visualization when tree changes
  $: if (cy && $tree) {
    updateVisualization($tree);
  }

  function updateVisualization(tree) {
    const elements = [];

    tree.nodes.forEach(node => {
      elements.push({ data: { id: node.id, label: node.id.slice(0, 8) } });

      if (node.parent) {
        elements.push({ data: { source: node.parent, target: node.id } });
      }
    });

    cy.json({ elements });
    cy.layout({ name: 'breadthfirst' }).run();
  }
</script>

<div bind:this={container} class="tree-canvas"></div>

<style>
  .tree-canvas {
    width: 100%;
    height: 100%;
    background: var(--loom-bg);
  }
</style>
```

## Debugging

### Browser DevTools

- **Chrome DevTools**: F12
- **Svelte DevTools**: [Chrome extension](https://chrome.google.com/webstore/detail/svelte-devtools/ckolcbmkjpjmangdbmnkpjigpkddpogn)
- **React DevTools**: [Chrome extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

### Logging

Use consistent logging:

```javascript
const DEBUG = import.meta.env.DEV;

export function log(...args) {
  if (DEBUG) {
    console.log('[Loom]', ...args);
  }
}

export function error(...args) {
  console.error('[Loom Error]', ...args);
}
```

### Source Maps

Enabled in development automatically with Vite.

## Performance Optimization

### Large Trees

For trees with 100+ nodes:

1. **Virtualization**: Only render visible nodes
2. **Memoization**: Cache expensive computations
3. **Debouncing**: Debounce zoom/pan updates
4. **Lazy loading**: Load collapsed branches on demand

### Bundle Size

Monitor bundle size:
```bash
npm run build
npx vite-bundle-visualizer
```

Optimize:
- Tree-shake unused code
- Code splitting for large dependencies
- Lazy load non-critical components

## Deployment

### Build

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run build
npx gh-pages -d dist
```

### Deploy to Netlify

1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Auto-deploys on push

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Follow prompts.

## Contributing

### Workflow

1. **Fork** repository
2. **Create branch**: `git checkout -b feature/your-feature`
3. **Make changes**
4. **Test**: `npm test`
5. **Lint**: `npm run lint`
6. **Commit**: `git commit -m "Add your feature"`
7. **Push**: `git push origin feature/your-feature`
8. **Pull Request**: Open PR on GitHub

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add keyboard navigation`
- `fix: correct tree layout bug`
- `docs: update user guide`
- `refactor: simplify tree traversal`
- `test: add path computation tests`

### Code Review

PRs reviewed for:
- Functionality
- Code style
- Tests
- Documentation
- Performance

## Release Process

### Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes (2.0.0)
- **MINOR**: New features (1.1.0)
- **PATCH**: Bug fixes (1.0.1)

### Releasing

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit: `git commit -m "chore: release v1.1.0"`
4. Tag: `git tag v1.1.0`
5. Push: `git push && git push --tags`
6. Create GitHub release

## Resources

### Documentation
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Cytoscape.js Docs](https://js.cytoscape.org/)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev/)

### Community
- GitHub Discussions
- Discord (if created)
- Stack Overflow tag: `athanor-loom`

## Getting Help

- Check existing [documentation](./README.md)
- Search [GitHub Issues](https://github.com/your-org/athanor-loom/issues)
- Ask in [Discussions](https://github.com/your-org/athanor-loom/discussions)
- Join community chat

## License

See [LICENSE](../LICENSE) for details.
