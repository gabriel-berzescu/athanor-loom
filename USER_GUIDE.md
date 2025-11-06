# User Guide

Complete guide to using the Athanor Loom interface.

## Getting Started

### Installation

1. Clone the repository or download the files
2. Navigate to the folder
3. Double-click `index.html` (or open it in your browser)

No installation, no server, no dependencies. It just works.

### First Launch

When you first open Athanor Loom:

1. **Open Settings**: Click the settings button (usually a gear icon)
2. **Enter API Key**: Paste your OpenRouter API key
3. **Choose Model**: Enter a base model name (e.g., `meta-llama/llama-3.1-8b-instruct`)
4. **Adjust Parameters** (optional):
   - Temperature: Controls randomness (0.0 - 2.0, default ~0.7)
   - Max Tokens: Length of each generation (default reasonable value)
   - Top P, Top K, etc.
5. **Close Settings**: The drawer slides closed

Your settings are saved in browser storage.

## Interface Layout

```
┌─────────────────────────────────────────────────┐
│  [Settings] [Load] [Generate 3] [5] [7] [Search]│  ← Toolbar
├──────────────────┬──────────────────────────────┤
│                  │                              │
│   Left Panel     │      Right Panel             │
│                  │                              │
│   Full text      │      Tree View               │
│   from root      │                              │
│   to selected    │      [Interactive tree]      │
│   node           │                              │
│                  │      Pan, zoom, navigate     │
│                  │                              │
│   (scrollable)   │                              │
│                  │                              │
└──────────────────┴──────────────────────────────┘
      50%                    50%
```

### Left Panel
- Shows complete text from root to currently selected node
- Scrollable for long paths
- Editable (click to edit any node's portion)
- Search highlights appear here

### Right Panel
- Interactive tree visualization
- Root at bottom, branches grow upward
- Pan by dragging
- Zoom with scroll wheel
- Click nodes to select them
- Hover nodes for preview

## Creating Your First Tree

### Step 1: Write the Root

1. The root node input field is visible when you start
2. Type your initial text (this is your seed)
3. This becomes the foundation of your tree

Example:
```
The old lighthouse keeper had a secret.
```

### Step 2: Generate First Branches

1. Click **Generate 3** (or 5 or 7)
2. Watch as three child nodes appear above the root
3. Loading spinners show during generation
4. Each child is a different continuation

You now have:
```
    [Child 1]    [Child 2]    [Child 3]
         \           |           /
          \          |          /
           \         |         /
         [ The old lighthouse... ]
```

### Step 3: Explore a Path

1. Click on **Child 1**
2. Left panel shows: "The old lighthouse keeper had a secret. [Child 1's text]"
3. This is your first complete path

### Step 4: Continue Branching

1. With Child 1 selected, click **Generate 3** again
2. Three new nodes appear above Child 1
3. You're exploring deeper down that branch
4. Click other children to explore alternative paths

## Core Operations

### Selecting Nodes

**Mouse**: Click any node in the tree

**Keyboard**:
- **↓**: Move to parent
- **↑**: Move to a child (if multiple, moves to first)
- **←/→**: Move between siblings

**Result**:
- Node highlights in tree
- Full path shows in left panel
- Path from root to that node also highlights in tree

### Generating Children

1. Select a node
2. Click **Generate 3**, **Generate 5**, or **Generate 7**
3. Loading spinners appear
4. New children appear above the selected node

**Notes**:
- You can generate from any node, even if it has children
- New children add to existing ones
- Generated text continues from the full path to that node

### Editing Nodes

1. Select a node
2. In the left panel, find that node's portion of text
3. Click to edit it
4. Type your changes
5. Changes save automatically

**Important**: Editing a node doesn't change its children. They stay as originally generated.

### Deleting Nodes

When a node is selected, you have two delete options:

**Delete All Children**:
- Removes all descendants (children, grandchildren, etc.)
- Keeps the selected node
- Useful before regenerating

**Delete Node + Children**:
- Removes the selected node
- Removes all its descendants
- The parent node remains

**Note**: You cannot delete the root node.

### Hovering for Preview

Hover your mouse over any node in the tree:
- A tooltip appears
- Shows just that node's text (not the full path)
- Useful for quick scanning without clicking

### Collapsing Branches

Click the **+** indicator on a node to collapse/expand:
- **Collapsed**: Hides all descendants, shows **+**
- **Expanded**: Shows children, shows **-**
- Useful for managing large trees

## Navigation

### Mouse/Touch Navigation

- **Click node**: Select and view path
- **Drag tree**: Pan around
- **Scroll**: Zoom in/out
- **Hover**: Preview node text
- **Click +/-**: Collapse/expand branches

### Keyboard Navigation

- **↓**: Move to parent
- **↑**: Move to child
- **←**: Previous sibling
- **→**: Next sibling
- **Enter**: Edit selected node (focuses left panel)

## Search

### Searching Your Tree

1. Click the **Search** button or field
2. Type your search term
3. Matching nodes highlight in the tree
4. Click a highlighted node
5. The left panel shows the full path
6. Your search term highlights in the left panel text

### Search Tips

- Search is case-insensitive
- Partial matches work
- Only searches node text, not metadata
- Clear search to remove highlights

## Managing Trees

### Saving

Trees automatically save to a JSON file:
1. Make changes to your tree
2. Click **Save** or **Download** (implementation specific)
3. Choose location on your filesystem
4. File saved as `tree-[timestamp].json` or similar

### Loading

1. Click **Load** dropdown
2. Choose "Load from file"
3. Select a `.json` tree file from your computer
4. Tree loads into the interface
5. Previous tree (if any) is replaced

### Creating New Tree

1. Click **New** or **Clear**
2. Confirms if you have unsaved changes
3. Interface resets to empty root node

## Settings

Open the settings drawer to configure:

### API Settings
- **OpenRouter API Key**: Your API key (required)
- **Model Name**: Base model identifier (e.g., `meta-llama/llama-3.1-8b-instruct`)

### Generation Parameters
- **Temperature**: Randomness (0.0 = deterministic, 2.0 = very random)
- **Max Tokens**: Length of each generation
- **Top P**: Nucleus sampling threshold
- **Top K**: Top-k sampling threshold
- **Frequency Penalty**: Reduce repetition
- **Presence Penalty**: Encourage new topics

### Interface Settings
- **Default Generation Count**: How many children to generate (3, 5, or 7)
- **Auto-save**: Enable/disable automatic saving
- **Dark Mode**: Toggle (though dark is default)

## Tips & Best Practices

### Start Broad, Then Narrow
Generate many alternatives early, then focus on promising branches.

### Use Editing Strategically
Edit nodes to steer the generation, then regenerate children for fresh alternatives.

### Delete Freely
Don't be afraid to prune uninteresting branches. Keep your tree manageable.

### Save Often
Save important trees as separate files so you can return to them.

### Explore Temperature
- Low temperature (0.2-0.5): More predictable, focused
- Medium temperature (0.7-1.0): Balanced
- High temperature (1.2-2.0): More creative, chaotic

### Name Your Files
Give tree files descriptive names so you can find them later:
- `story-lighthouse-draft1.json`
- `experiment-sci-fi-intro.json`

### Use Search for Large Trees
When trees grow large, use search to find specific content quickly.

### Keyboard for Speed
Learn keyboard shortcuts to navigate faster than clicking.

## Workflow Examples

### Creative Writing

1. Write opening sentence as root
2. Generate 7 alternatives for first continuation
3. Pick the most interesting 2-3
4. From each, generate 5 more
5. Read through paths, edit as needed
6. Continue branching from favorite directions
7. Eventually select final path and export

### Exploration

1. Write a premise or question as root
2. Generate 5 responses
3. From each response, generate 3 more
4. Compare how different initial directions evolve
5. Look for surprising or interesting patterns
6. Use search to find common themes

### Refinement

1. Write draft text as root
2. Generate 3 variations
3. Edit the best parts from each into a new node
4. Generate from edited version
5. Repeat until satisfied
6. Final path becomes polished output

## Troubleshooting

### "API Error" Message
- Check your API key in settings
- Verify you have OpenRouter credits
- Check internet connection
- Try again

### Nothing Generates
- Ensure model name is correct
- Check OpenRouter supports that model for text completion
- Verify max_tokens isn't too low

### Tree Looks Weird
- Try zooming out
- Reset zoom/pan
- Refresh the page (tree should auto-load if saved)

### Can't Find Old Tree
- Check your downloads/documents folder
- Tree files are JSON format
- Named with timestamp or custom name

### Performance Issues
- Very large trees (hundreds of nodes) may slow down
- Try collapsing branches you're not working on
- Save and start a new tree for new explorations

## Advanced Features

### Multiple Models
You can change the model in settings at any time. New generations use the new model. Existing nodes keep their text.

### Mixing Edited and Generated
Create hybrid trees: some nodes generated, some manually written. Edit nodes to steer, then generate to explore.

### Tree Comparison
Load two different tree files in separate browser tabs to compare different explorations from the same root.

### Exporting Paths
(If implemented) Select a node and export just that path as plain text for use elsewhere.

## Keyboard Shortcuts Summary

| Key | Action |
|-----|--------|
| ↓ | Parent node |
| ↑ | Child node |
| ← | Previous sibling |
| → | Next sibling |
| Enter | Edit selected node |
| Ctrl+S | Save tree |
| Ctrl+F | Focus search |
| Esc | Close drawer/dialog |

(Shortcuts may vary based on implementation)

## Next Steps

- Read [CONCEPTS.md](CONCEPTS.md) for deeper understanding
- Check [API_INTEGRATION.md](API_INTEGRATION.md) for model selection tips
- See [FILE_FORMAT.md](FILE_FORMAT.md) to understand tree structure
- Review [DEVELOPMENT.md](DEVELOPMENT.md) to contribute
