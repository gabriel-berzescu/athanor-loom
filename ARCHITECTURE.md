# Architecture

Technical design and implementation architecture for Athanor Loom.

## Overview

Athanor Loom is a client-side web application with no backend. All computation happens in the browser, and all data is stored on the user's filesystem.

```
┌──────────────────────────────────────────┐
│           Browser Application            │
│                                          │
│  ┌────────────┐  ┌──────────────────┐   │
│  │    UI      │  │  Tree Manager    │   │
│  │ Components │←→│  (State/Logic)   │   │
│  └────────────┘  └──────────────────┘   │
│         ↓                  ↓             │
│  ┌────────────┐  ┌──────────────────┐   │
│  │   Tree     │  │   API Client     │   │
│  │ Renderer   │  │  (OpenRouter)    │   │
│  └────────────┘  └──────────────────┘   │
│         ↓                  ↓             │
│  ┌────────────┐  ┌──────────────────┐   │
│  │  Canvas/   │  │  File System     │   │
│  │  SVG Layer │  │  (Save/Load)     │   │
│  └────────────┘  └──────────────────┘   │
└──────────────────────────────────────────┘
           ↓                    ↓
    ┌──────────┐         ┌─────────────┐
    │ Browser  │         │  OpenRouter │
    │  APIs    │         │     API     │
    └──────────┘         └─────────────┘
```

## Tech Stack

### Frontend Framework
**Recommendation**: React or Svelte

**Rationale**:
- **React**: Large ecosystem, familiar to many developers, excellent for complex state
- **Svelte**: Smaller bundle, simpler syntax, great for this use case

Either works well. Svelte may be slightly better for a lightweight, no-backend app.

### Tree Visualization
**Recommendation**: D3.js or vis.js or Cytoscape.js

**Options**:
- **D3.js**: Maximum flexibility, full control, steeper learning curve
- **vis.js**: Easier to use, built-in features, less customization
- **Cytoscape.js**: Excellent for graph/tree layouts, interactive

For Athanor Loom, **Cytoscape.js** or **D3.js** are recommended for the level of interaction needed.

### State Management
**Recommendation**:
- **React**: Zustand or Redux Toolkit
- **Svelte**: Built-in stores

**State to manage**:
- Tree structure (nodes, edges)
- Selected node
- Collapsed/expanded branches
- Settings (API key, model, parameters)
- Search state
- UI state (drawer open/closed, etc.)

### Styling
**Recommendation**: Tailwind CSS or styled-components

**Rationale**:
- **Tailwind**: Utility-first, fast development, consistent design
- **styled-components**: Component-scoped styles, dynamic styling

For dark mode and responsive design, **Tailwind** is excellent.

### File Handling
**Browser APIs**:
- **File System Access API**: For reading/writing local files
- **Fallback**: Download/upload pattern for browsers without File System Access API

### API Client
**Fetch API** for HTTP requests to OpenRouter.

## Component Structure

```
App
├── Toolbar
│   ├── SettingsButton → SettingsDrawer
│   ├── LoadDropdown
│   ├── GenerateButtons (3, 5, 7)
│   └── SearchBar
├── MainLayout
│   ├── LeftPanel (TextViewer)
│   │   └── EditableText
│   └── RightPanel (TreeView)
│       └── TreeCanvas
│           ├── Nodes
│           ├── Edges
│           └── InteractionLayer
└── SettingsDrawer
    ├── APISettings
    ├── GenerationParameters
    └── InterfaceSettings
```

### Component Responsibilities

#### App
- Top-level state management
- Coordinate between panels
- Handle keyboard shortcuts
- Manage settings persistence

#### Toolbar
- Action buttons
- Quick access to common operations
- Search interface

#### SettingsDrawer
- API configuration
- Parameter adjustments
- Interface preferences
- Slides in from left or right

#### LeftPanel (TextViewer)
- Display full path text
- Handle editing
- Show search highlights
- Scroll management

#### RightPanel (TreeView)
- Render tree visualization
- Handle pan/zoom
- Node selection
- Hover previews
- Collapse/expand

#### TreeCanvas
- Visual rendering of tree
- Interactive layer for clicks
- Animation during generation
- Highlight selected path

## Data Models

### Tree Structure

```javascript
{
  "root": "node-id-1",
  "nodes": {
    "node-id-1": {
      "id": "node-id-1",
      "text": "The old lighthouse keeper had a secret.",
      "parent": null,
      "children": ["node-id-2", "node-id-3", "node-id-4"],
      "collapsed": false,
      "metadata": {
        "created": "2024-01-15T10:30:00Z",
        "model": "meta-llama/llama-3.1-8b-instruct",
        "temperature": 0.7,
        "edited": false
      }
    },
    "node-id-2": {
      "id": "node-id-2",
      "text": " He kept a journal of every ship...",
      "parent": "node-id-1",
      "children": [],
      "collapsed": false,
      "metadata": { ... }
    },
    ...
  },
  "metadata": {
    "created": "2024-01-15T10:00:00Z",
    "modified": "2024-01-15T11:00:00Z",
    "totalNodes": 42,
    "version": "1.0"
  }
}
```

### Settings

```javascript
{
  "api": {
    "apiKey": "sk-or-...",
    "modelName": "meta-llama/llama-3.1-8b-instruct"
  },
  "generation": {
    "temperature": 0.7,
    "maxTokens": 256,
    "topP": 0.9,
    "topK": 40,
    "frequencyPenalty": 0.0,
    "presencePenalty": 0.0
  },
  "interface": {
    "defaultGenerationCount": 3,
    "autoSave": false,
    "darkMode": true
  }
}
```

### UI State

```javascript
{
  "selectedNodeId": "node-id-5",
  "collapsedNodes": ["node-id-3", "node-id-7"],
  "searchTerm": "",
  "matchingNodes": ["node-id-2", "node-id-8"],
  "drawerOpen": false,
  "zoom": 1.0,
  "panOffset": { x: 0, y: 100 },
  "loadingNodes": ["node-id-9"]  // Currently generating
}
```

## Core Algorithms

### Path Computation

When a node is selected, compute the full path from root:

```javascript
function getPathToNode(nodeId, tree) {
  const path = [];
  let currentId = nodeId;

  while (currentId !== null) {
    const node = tree.nodes[currentId];
    path.unshift(node);  // Add to front
    currentId = node.parent;
  }

  return path;
}
```

### Text Concatenation

Combine path nodes into full text for display and API calls:

```javascript
function getFullText(path) {
  return path.map(node => node.text).join('');
}
```

### Tree Layout

For tree rendering, use a hierarchical layout algorithm:

1. **Level assignment**: BFS to assign depth levels
2. **Horizontal positioning**: Distribute siblings evenly
3. **Vertical positioning**: Stack levels with padding
4. **Edge routing**: Draw curves between parents and children

Libraries like D3 or Cytoscape handle this automatically.

### Generation Flow

```javascript
async function generateChildren(parentNodeId, count) {
  // 1. Get full text path to parent
  const path = getPathToNode(parentNodeId, tree);
  const promptText = getFullText(path);

  // 2. Mark parent as loading
  setLoadingNodes([...loadingNodes, parentNodeId]);

  // 3. Make parallel API calls
  const promises = Array(count).fill().map(() =>
    callOpenRouter(promptText, settings)
  );

  // 4. Wait for all completions
  const completions = await Promise.all(promises);

  // 5. Create new nodes
  const newNodes = completions.map(text => ({
    id: generateId(),
    text: text,
    parent: parentNodeId,
    children: [],
    collapsed: false,
    metadata: {
      created: new Date().toISOString(),
      model: settings.api.modelName,
      temperature: settings.generation.temperature,
      edited: false
    }
  }));

  // 6. Update tree
  updateTree(parentNodeId, newNodes);

  // 7. Remove loading state
  setLoadingNodes(loadingNodes.filter(id => id !== parentNodeId));
}
```

### Delete Operations

**Delete node and children**:
```javascript
function deleteNodeAndChildren(nodeId, tree) {
  const toDelete = [nodeId];
  const visited = new Set();

  // BFS to collect all descendants
  while (toDelete.length > 0) {
    const currentId = toDelete.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = tree.nodes[currentId];
    toDelete.push(...node.children);
  }

  // Remove from tree
  visited.forEach(id => delete tree.nodes[id]);

  // Update parent's children array
  const parent = tree.nodes[tree.nodes[nodeId].parent];
  parent.children = parent.children.filter(id => id !== nodeId);
}
```

**Delete all children**:
```javascript
function deleteAllChildren(nodeId, tree) {
  const node = tree.nodes[nodeId];

  // Get all descendants
  const descendants = getAllDescendants(nodeId, tree);

  // Remove them
  descendants.forEach(id => delete tree.nodes[id]);

  // Clear children array
  node.children = [];
}
```

### Search

```javascript
function searchTree(searchTerm, tree) {
  const matches = [];

  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    if (node.text.toLowerCase().includes(searchTerm.toLowerCase())) {
      matches.push(nodeId);
    }
  }

  return matches;
}
```

## File System Integration

### Saving

```javascript
async function saveTree(tree, filename) {
  const json = JSON.stringify(tree, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  // Modern approach: File System Access API
  if ('showSaveFilePicker' in window) {
    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [{
        description: 'Loom Tree',
        accept: { 'application/json': ['.json'] }
      }]
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } else {
    // Fallback: Download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

### Loading

```javascript
async function loadTree() {
  // Modern approach: File System Access API
  if ('showOpenFilePicker' in window) {
    const [handle] = await window.showOpenFilePicker({
      types: [{
        description: 'Loom Tree',
        accept: { 'application/json': ['.json'] }
      }],
      multiple: false
    });
    const file = await handle.getFile();
    const text = await file.text();
    return JSON.parse(text);
  } else {
    // Fallback: File input
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        const text = await file.text();
        resolve(JSON.parse(text));
      };
      input.click();
    });
  }
}
```

## Rendering Strategy

### Tree Rendering

**Option 1: Canvas**
- Fast for large trees
- Manual interaction handling
- No DOM overhead

**Option 2: SVG**
- Easy interaction (click, hover)
- DOM-based (can be slower for huge trees)
- Easier to style and animate

**Recommendation**: **SVG** for easier interaction, with virtualization if performance becomes an issue.

### Text Rendering

**HTML** for the left panel:
- Easy editing
- Search highlighting with `<mark>` tags
- Standard text selection
- Scroll with native browser behavior

## Performance Considerations

### Large Trees

For trees with hundreds of nodes:

1. **Virtualization**: Only render visible nodes
2. **Collapse by default**: Collapse branches beyond certain depth
3. **Lazy loading**: Load tree structure progressively
4. **Debouncing**: Debounce zoom/pan updates

### API Rate Limiting

- Queue requests to avoid overwhelming API
- Show clear feedback during generation
- Handle errors gracefully

### Browser Storage

Settings stored in `localStorage`:
```javascript
localStorage.setItem('loom-settings', JSON.stringify(settings));
```

## Accessibility

- **Keyboard navigation**: Full tree navigation without mouse
- **ARIA labels**: Screen reader support
- **Focus indicators**: Clear visual focus
- **Color contrast**: WCAG AA compliance for dark mode

## Browser Compatibility

Target modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Features to polyfill or fallback:
- File System Access API (fallback to download/upload)
- Optional chaining (transpile)
- Nullish coalescing (transpile)

## Build Setup

### Development
- Hot module reload
- Source maps
- Fast refresh

### Production
- Minification
- Tree shaking
- Asset optimization
- Single HTML + JS + CSS bundle

Tools:
- **Vite**: Fast, modern, excellent DX
- **Webpack**: More configuration, very flexible
- **Parcel**: Zero config, simple

**Recommendation**: **Vite** for speed and simplicity.

## Directory Structure

```
athanor-loom/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── App.jsx
│   │   ├── Toolbar.jsx
│   │   ├── SettingsDrawer.jsx
│   │   ├── LeftPanel.jsx
│   │   ├── RightPanel.jsx
│   │   └── TreeCanvas.jsx
│   ├── lib/
│   │   ├── tree.js          # Tree data structure
│   │   ├── api.js           # OpenRouter client
│   │   ├── storage.js       # File save/load
│   │   └── layout.js        # Tree layout algorithms
│   ├── store/
│   │   └── state.js         # State management
│   ├── styles/
│   │   └── main.css
│   └── main.jsx
├── docs/
│   ├── README.md
│   ├── CONCEPTS.md
│   ├── USER_GUIDE.md
│   ├── ARCHITECTURE.md
│   ├── API_INTEGRATION.md
│   ├── FILE_FORMAT.md
│   └── DEVELOPMENT.md
├── package.json
├── vite.config.js
└── LICENSE
```

## Security Considerations

### API Key Storage
- Never commit API keys to repo
- Store in browser localStorage only
- Warn users about sharing files (don't include keys in tree JSON)
- Consider encryption for stored keys

### XSS Prevention
- Sanitize any user input displayed in HTML
- Use framework's built-in escaping (React, Svelte do this automatically)

### CORS
- OpenRouter API should support CORS
- All requests are client-side

## Future Enhancements

Potential features for future versions:

- **Annotations**: Add notes to nodes without editing text
- **Node types**: Mark nodes as "favorite", "discard", etc.
- **Diff view**: Compare two sibling nodes
- **Export paths**: Export selected path as markdown
- **Undo/redo**: History of tree modifications
- **Collaborative editing**: Sync trees between users (requires backend)
- **Advanced search**: Regex, metadata filtering
- **Statistics**: Token usage, branch depth, etc.
- **Themes**: Multiple color schemes
- **Mobile support**: Touch-optimized interface

## Testing Strategy

### Unit Tests
- Tree manipulation functions
- Path computation
- Search algorithm
- Serialization/deserialization

### Integration Tests
- Component interactions
- State updates
- File save/load

### E2E Tests
- Full user workflows
- Generation and editing
- Navigation

Tools: Vitest, React Testing Library, Playwright

## Deployment

Since it's a static site:

1. **Build**: `npm run build`
2. **Deploy**:
   - GitHub Pages
   - Netlify
   - Vercel
   - Or just share the built `index.html`

Users can also just clone and open `index.html` locally - no deployment needed.
