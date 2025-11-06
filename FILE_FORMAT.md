# File Format Specification

Complete specification for Athanor Loom's tree file format.

## Overview

Athanor Loom stores trees as JSON files. Each file contains:
- Complete tree structure (nodes and relationships)
- All text content
- Metadata about creation and modifications
- Generation parameters used

Files use `.json` extension and are human-readable.

## Format Version

Current version: **1.0**

Future versions will increment this number and maintain backward compatibility where possible.

## Top-Level Structure

```json
{
  "version": "1.0",
  "root": "node-uuid-1",
  "nodes": { ... },
  "metadata": { ... }
}
```

### Fields

- **version** (string): Format version for compatibility
- **root** (string): UUID of the root node
- **nodes** (object): Map of node IDs to node objects
- **metadata** (object): Tree-level metadata

## Node Structure

Each node in the `nodes` object:

```json
{
  "node-uuid-1": {
    "id": "node-uuid-1",
    "text": "The old lighthouse keeper had a secret.",
    "parent": null,
    "children": ["node-uuid-2", "node-uuid-3", "node-uuid-4"],
    "collapsed": false,
    "metadata": {
      "created": "2024-01-15T10:30:00.000Z",
      "model": "meta-llama/llama-3.1-8b-instruct",
      "temperature": 0.7,
      "maxTokens": 256,
      "edited": false,
      "editedAt": null
    }
  }
}
```

### Node Fields

#### Required Fields

- **id** (string): Unique identifier (UUID v4)
- **text** (string): The text content of this node
- **parent** (string | null): Parent node ID, or `null` for root
- **children** (array of strings): Array of child node IDs
- **collapsed** (boolean): Whether this node's children are visually collapsed

#### Metadata Object

- **created** (string): ISO 8601 timestamp of node creation
- **model** (string | null): Model used to generate (null if manually created)
- **temperature** (number | null): Temperature parameter used
- **maxTokens** (number | null): Max tokens parameter used
- **edited** (boolean): Whether user has edited this node
- **editedAt** (string | null): ISO 8601 timestamp of last edit

Additional parameters can be added as needed:
- **topP** (number | null)
- **topK** (number | null)
- **frequencyPenalty** (number | null)
- **presencePenalty** (number | null)

## Tree Metadata

```json
{
  "metadata": {
    "created": "2024-01-15T10:00:00.000Z",
    "modified": "2024-01-15T11:30:00.000Z",
    "totalNodes": 42,
    "title": "Lighthouse Story",
    "description": "Exploring different narrative directions for lighthouse keeper story"
  }
}
```

### Metadata Fields

- **created** (string): ISO 8601 timestamp of tree creation
- **modified** (string): ISO 8601 timestamp of last modification
- **totalNodes** (number): Total number of nodes in tree
- **title** (string, optional): User-provided title
- **description** (string, optional): User-provided description

## Example Complete File

```json
{
  "version": "1.0",
  "root": "550e8400-e29b-41d4-a716-446655440000",
  "nodes": {
    "550e8400-e29b-41d4-a716-446655440000": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "text": "The old lighthouse keeper had a secret.",
      "parent": null,
      "children": [
        "550e8400-e29b-41d4-a716-446655440001",
        "550e8400-e29b-41d4-a716-446655440002",
        "550e8400-e29b-41d4-a716-446655440003"
      ],
      "collapsed": false,
      "metadata": {
        "created": "2024-01-15T10:00:00.000Z",
        "model": null,
        "temperature": null,
        "maxTokens": null,
        "edited": false,
        "editedAt": null
      }
    },
    "550e8400-e29b-41d4-a716-446655440001": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "text": " He kept a journal of every ship that passed in the night, cataloging their lights and sounds with meticulous detail.",
      "parent": "550e8400-e29b-41d4-a716-446655440000",
      "children": [
        "550e8400-e29b-41d4-a716-446655440004",
        "550e8400-e29b-41d4-a716-446655440005"
      ],
      "collapsed": false,
      "metadata": {
        "created": "2024-01-15T10:05:00.000Z",
        "model": "meta-llama/llama-3.1-8b-instruct",
        "temperature": 0.7,
        "maxTokens": 256,
        "topP": 0.9,
        "topK": 40,
        "frequencyPenalty": 0.0,
        "presencePenalty": 0.0,
        "edited": false,
        "editedAt": null
      }
    },
    "550e8400-e29b-41d4-a716-446655440002": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "text": " Nobody knew about the room beneath the lighthouse, accessible only through a hidden trapdoor.",
      "parent": "550e8400-e29b-41d4-a716-446655440000",
      "children": [],
      "collapsed": false,
      "metadata": {
        "created": "2024-01-15T10:05:01.000Z",
        "model": "meta-llama/llama-3.1-8b-instruct",
        "temperature": 0.7,
        "maxTokens": 256,
        "topP": 0.9,
        "topK": 40,
        "frequencyPenalty": 0.0,
        "presencePenalty": 0.0,
        "edited": false,
        "editedAt": null
      }
    },
    "550e8400-e29b-41d4-a716-446655440003": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "text": " At night, when the beam swept across the dark waters, he would transmit coded messages to ships he'd never met.",
      "parent": "550e8400-e29b-41d4-a716-446655440000",
      "children": [],
      "collapsed": false,
      "metadata": {
        "created": "2024-01-15T10:05:02.000Z",
        "model": "meta-llama/llama-3.1-8b-instruct",
        "temperature": 0.7,
        "maxTokens": 256,
        "topP": 0.9,
        "topK": 40,
        "frequencyPenalty": 0.0,
        "presencePenalty": 0.0,
        "edited": true,
        "editedAt": "2024-01-15T10:15:00.000Z"
      }
    },
    "550e8400-e29b-41d4-a716-446655440004": {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "text": " One stormy evening, he noticed a pattern in the logs—the same ship appeared exactly every seven days.",
      "parent": "550e8400-e29b-41d4-a716-446655440001",
      "children": [],
      "collapsed": false,
      "metadata": {
        "created": "2024-01-15T10:20:00.000Z",
        "model": "meta-llama/llama-3.1-8b-instruct",
        "temperature": 0.8,
        "maxTokens": 256,
        "topP": 0.9,
        "topK": 40,
        "frequencyPenalty": 0.0,
        "presencePenalty": 0.0,
        "edited": false,
        "editedAt": null
      }
    },
    "550e8400-e29b-41d4-a716-446655440005": {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "text": " But what he never wrote down was that each entry was a lie, carefully constructed to hide what he really saw.",
      "parent": "550e8400-e29b-41d4-a716-446655440001",
      "children": [],
      "collapsed": false,
      "metadata": {
        "created": "2024-01-15T10:20:01.000Z",
        "model": "meta-llama/llama-3.1-8b-instruct",
        "temperature": 0.8,
        "maxTokens": 256,
        "topP": 0.9,
        "topK": 40,
        "frequencyPenalty": 0.0,
        "presencePenalty": 0.0,
        "edited": false,
        "editedAt": null
      }
    }
  },
  "metadata": {
    "created": "2024-01-15T10:00:00.000Z",
    "modified": "2024-01-15T10:20:01.000Z",
    "totalNodes": 6,
    "title": "Lighthouse Keeper's Secret",
    "description": "Branching narrative exploration"
  }
}
```

## Tree Structure Visualization

The above example creates this tree:

```
                [Node 4]  [Node 5]
                     \      /
                      \    /
                    [Node 1]
                       |
[Node 2]  [Node 3]     |
      \      |        /
       \     |       /
        \    |      /
         [ Root ]
```

## Node ID Generation

Use **UUID v4** for node IDs:

```javascript
function generateNodeId() {
  return crypto.randomUUID();  // Modern browsers
}
```

Benefits:
- Globally unique
- No collisions between trees
- Secure random generation
- Standard format

## Validation

### Required Validations

When loading a file, validate:

1. **Version exists**: `version` field present
2. **Root exists**: `root` field present and references valid node
3. **Root has no parent**: `nodes[root].parent === null`
4. **All children exist**: Every ID in `children` arrays exists in `nodes`
5. **Parent references match**: If A has B as child, B has A as parent
6. **No cycles**: Tree structure is acyclic
7. **Connected**: All nodes reachable from root

### Validation Example

```javascript
function validateTree(tree) {
  const errors = [];

  // Check version
  if (!tree.version) {
    errors.push('Missing version field');
  }

  // Check root exists
  if (!tree.root || !tree.nodes[tree.root]) {
    errors.push('Invalid root node');
  }

  // Check root has no parent
  if (tree.nodes[tree.root]?.parent !== null) {
    errors.push('Root node must have null parent');
  }

  // Check all children exist
  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    for (const childId of node.children) {
      if (!tree.nodes[childId]) {
        errors.push(`Node ${nodeId} references non-existent child ${childId}`);
      }
    }
  }

  // Check parent-child relationships match
  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    if (node.parent !== null) {
      const parent = tree.nodes[node.parent];
      if (!parent.children.includes(nodeId)) {
        errors.push(`Parent-child mismatch for node ${nodeId}`);
      }
    }
  }

  return errors;
}
```

## Migration

### Future Format Changes

If the format changes in future versions:

```javascript
function migrateTree(tree) {
  switch (tree.version) {
    case '1.0':
      return tree;  // Current version
    case '0.9':
      return migrateFrom0_9(tree);
    default:
      throw new Error(`Unsupported version: ${tree.version}`);
  }
}
```

### Adding New Fields

When adding optional fields:
- Old files still valid
- New fields have defaults
- Version number may not need to change

Example: Adding `topP` to metadata:
- Old files: `topP` undefined
- New files: `topP` included
- Both work fine

### Breaking Changes

If structure changes fundamentally:
- Increment version number
- Provide migration function
- Document changes clearly

## File Naming

### Suggested Convention

`loom-[title]-[timestamp].json`

Examples:
- `loom-lighthouse-story-2024-01-15.json`
- `loom-poem-exploration-2024-01-15-10-30.json`
- `loom-untitled-2024-01-15.json`

### Auto-Generated Names

If user doesn't provide a title:

```javascript
function generateFileName() {
  const timestamp = new Date().toISOString().slice(0, 10);
  return `loom-tree-${timestamp}.json`;
}
```

## Serialization

### Saving

```javascript
function serializeTree(tree) {
  return JSON.stringify(tree, null, 2);  // Pretty-printed
}
```

Pretty printing (2-space indent) makes files:
- Human-readable
- Git-friendly
- Debuggable

### Loading

```javascript
function deserializeTree(jsonString) {
  const tree = JSON.parse(jsonString);
  const errors = validateTree(tree);

  if (errors.length > 0) {
    throw new Error('Invalid tree file: ' + errors.join(', '));
  }

  return tree;
}
```

## File Size Considerations

### Typical Sizes

- **Small tree** (10 nodes): ~5-10 KB
- **Medium tree** (100 nodes): ~50-100 KB
- **Large tree** (1000 nodes): ~500 KB - 1 MB

### Compression

For very large trees, consider:
- Gzip compression (browser handles this)
- Minified JSON (no pretty printing)
- External storage for metadata

## Import/Export

### Export

User clicks "Save" or "Export":

```javascript
async function exportTree(tree) {
  const json = serializeTree(tree);
  const blob = new Blob([json], { type: 'application/json' });
  const filename = `loom-${tree.metadata.title || 'tree'}-${Date.now()}.json`;

  // Modern File System Access API
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
    // Fallback: download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

### Import

User clicks "Load":

```javascript
async function importTree() {
  let json;

  // Modern File System Access API
  if ('showOpenFilePicker' in window) {
    const [handle] = await window.showOpenFilePicker({
      types: [{
        description: 'Loom Tree',
        accept: { 'application/json': ['.json'] }
      }],
      multiple: false
    });
    const file = await handle.getFile();
    json = await file.text();
  } else {
    // Fallback: file input
    json = await new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        const text = await file.text();
        resolve(text);
      };
      input.click();
    });
  }

  return deserializeTree(json);
}
```

## Best Practices

### For Developers

- Always validate trees on load
- Handle missing fields gracefully
- Preserve unknown fields for forward compatibility
- Use pretty-printed JSON for readability
- Generate proper UUIDs for node IDs

### For Users

- Save trees regularly
- Use descriptive filenames
- Back up important trees
- Don't manually edit files (unless you know what you're doing)
- Keep one file per tree

## Debugging

### Inspecting Files

Files are JSON, so you can:
- Open in any text editor
- Use `jq` for command-line inspection
- Validate with online JSON validators

### Common Issues

**Orphaned nodes**: Node exists but isn't reachable from root
- Fix: Remove from `nodes` object

**Circular references**: Node is its own ancestor
- Fix: Break the cycle

**Mismatched relationships**: Parent doesn't list child, or vice versa
- Fix: Reconcile the relationships

## Future Extensions

Possible additions to format:

### Annotations
```json
{
  "annotations": {
    "node-uuid-1": {
      "note": "This is my favorite branch",
      "color": "#ff0000",
      "tags": ["interesting", "creative"]
    }
  }
}
```

### Branching History
Track when branches were created:
```json
{
  "history": [
    {
      "timestamp": "2024-01-15T10:00:00.000Z",
      "action": "create",
      "nodeId": "node-uuid-1"
    }
  ]
}
```

### Settings Snapshot
Remember settings used for this tree:
```json
{
  "settings": {
    "defaultModel": "meta-llama/llama-3.1-8b-instruct",
    "defaultTemperature": 0.7
  }
}
```

These would increment the version number to 2.0.
