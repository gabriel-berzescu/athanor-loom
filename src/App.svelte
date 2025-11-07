<script>
  import { onMount } from 'svelte';
  import Toolbar from './components/Toolbar.svelte';
  import LeftPanel from './components/LeftPanel.svelte';
  import TreeCanvas from './components/TreeCanvas.svelte';
  import { initializeTree } from './stores/treeStore.js';

  onMount(() => {
    console.log('=== Athanor Loom Initializing ===');
    initializeTree('Once upon a time');
    console.log('=== Athanor Loom Ready ===');
  });
</script>

<div class="app-container">
  <Toolbar />

  <div class="main-layout">
    <div class="left-panel-container">
      <LeftPanel />
    </div>

    <div class="right-panel-container">
      <TreeCanvas />
    </div>
  </div>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #1a1a1a;
    color: #e0e0e0;
    height: 100vh;
    overflow: hidden;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .main-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .left-panel-container {
    width: 50%;
    background: #1a1a1a;
    border-right: 1px solid #3a3a3a;
    overflow: hidden;
  }

  .right-panel-container {
    width: 50%;
    background: #1a1a1a;
    overflow: hidden;
  }
</style>
