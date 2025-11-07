<script>
  import { tree, selectedNodeId, addChildToSelected } from '../stores/treeStore.js';
  import { drawerOpen } from '../stores/uiStore.js';
  import { saveTree, loadTree } from '../lib/storage.js';

  function handleSettings() {
    drawerOpen.set(true);
  }

  function handleAddChild() {
    let currentSelected;
    selectedNodeId.subscribe(id => currentSelected = id)();

    if (!currentSelected) {
      alert('No node selected');
      return;
    }

    const newText = prompt('Enter text for new child node:', ' and they lived happily ever after.');
    if (newText === null) return; // User cancelled

    addChildToSelected(newText);
  }

  async function handleSave() {
    let currentTree;
    tree.subscribe(t => currentTree = t)();

    try {
      const success = await saveTree(currentTree);
      if (success) {
        alert('Tree saved successfully');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save tree: ' + error.message);
    }
  }

  async function handleLoad() {
    try {
      const data = await loadTree();
      if (!data) return; // User cancelled

      tree.update(t => {
        t.fromJSON(data);
        selectedNodeId.set(t.rootId);
        return t;
      });

      alert('Tree loaded successfully');
    } catch (error) {
      console.error('Load failed:', error);
      alert('Failed to load tree: ' + error.message);
    }
  }

  function handleExport() {
    let currentTree;
    tree.subscribe(t => currentTree = t)();

    const json = currentTree.toJSON();
    console.log('Exported tree:', json);

    const jsonString = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `athanor-loom-tree-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);

    alert('Tree exported to JSON file');
  }
</script>

<div class="toolbar">
  <h1 class="title">Athanor Loom</h1>

  <div class="controls">
    <button class="button secondary" on:click={handleSettings}>
      ⚙ Settings
    </button>

    <button class="button secondary" on:click={handleLoad}>
      Load
    </button>

    <button class="button secondary" on:click={handleSave}>
      Save
    </button>

    <button class="button primary" on:click={handleAddChild}>
      Add Child to Selected
    </button>

    <button class="button secondary" on:click={handleExport}>
      Export JSON
    </button>
  </div>
</div>

<style>
  .toolbar {
    background: #2a2a2a;
    border-bottom: 1px solid #3a3a3a;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #4a9eff;
    margin: 0;
  }

  .controls {
    display: flex;
    gap: 0.5rem;
  }

  .button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: opacity 0.2s;
  }

  .button:hover {
    opacity: 0.9;
  }

  .button.primary {
    background: #4a9eff;
    color: white;
  }

  .button.secondary {
    background: #666;
    color: white;
  }
</style>
