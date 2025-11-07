<script>
  import { tree, selectedNodeId, addChildToSelected } from '../stores/treeStore.js';
  import { drawerOpen, loadingNodes } from '../stores/uiStore.js';
  import { settings } from '../stores/settingsStore.js';
  import { saveTree, loadTree } from '../lib/storage.js';
  import { OpenRouterClient } from '../lib/api.js';

  let isGenerating = false;

  function handleSettings() {
    drawerOpen.set(true);
  }

  async function handleGenerate(count) {
    // Get current values from stores
    let currentSelected;
    let currentTree;
    let currentSettings;

    selectedNodeId.subscribe(id => currentSelected = id)();
    tree.subscribe(t => currentTree = t)();
    settings.subscribe(s => currentSettings = s)();

    // Validate selection
    if (!currentSelected) {
      alert('No node selected. Please select a node first.');
      return;
    }

    // Validate API key
    if (!currentSettings.api.apiKey) {
      alert('Please configure your OpenRouter API key in Settings first.');
      drawerOpen.set(true);
      return;
    }

    // Set loading state
    isGenerating = true;
    loadingNodes.update(nodes => [...nodes, currentSelected]);

    try {
      // Get full path text to selected node
      const promptText = currentTree.getFullPath(currentSelected);
      console.log(`Generating ${count} completions from node ${currentSelected}`);
      console.log('Prompt text:', promptText.substring(0, 100) + '...');

      // Create API client
      const client = new OpenRouterClient(
        currentSettings.api.apiKey,
        currentSettings.api.modelName
      );

      // Generate multiple completions
      const completions = await client.generateMultiple(
        promptText,
        count,
        currentSettings.generation
      );

      console.log(`Generated ${completions.length} completions`);

      // Add each completion as a child node
      tree.update(t => {
        completions.forEach(text => {
          t.addChildNode(currentSelected, text);
        });
        return t;
      });

      console.log('Successfully added child nodes');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed: ' + error.message);
    } finally {
      // Clear loading state
      isGenerating = false;
      loadingNodes.update(nodes => nodes.filter(id => id !== currentSelected));
    }
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

    <div class="button-group">
      <button
        class="button generate"
        on:click={() => handleGenerate(3)}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate 3'}
      </button>

      <button
        class="button generate"
        on:click={() => handleGenerate(5)}
        disabled={isGenerating}
      >
        Generate 5
      </button>

      <button
        class="button generate"
        on:click={() => handleGenerate(7)}
        disabled={isGenerating}
      >
        Generate 7
      </button>
    </div>

    <button class="button secondary" on:click={handleAddChild}>
      Add Child Manually
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
    align-items: center;
  }

  .button-group {
    display: flex;
    gap: 0.25rem;
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

  .button:hover:not(:disabled) {
    opacity: 0.9;
  }

  .button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button.primary {
    background: #4a9eff;
    color: white;
  }

  .button.secondary {
    background: #666;
    color: white;
  }

  .button.generate {
    background: #4a9eff;
    color: white;
  }
</style>
