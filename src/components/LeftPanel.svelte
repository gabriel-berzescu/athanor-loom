<script>
  import { tree, selectedNode, selectedPath } from '../stores/treeStore.js';
</script>

<div class="left-panel">
  <h2 class="panel-title">Text View</h2>

  <div class="tree-info">
    <div><strong>Tree Statistics</strong></div>
    <div class="stat">Total Nodes: {$tree.nodes.size}</div>
    {#if $selectedNode}
      <div class="stat">Selected Node: {$selectedNode.id.substring(0, 16)}...</div>
    {:else}
      <div class="stat">Selected Node: None</div>
    {/if}
  </div>

  <div class="text-view">
    <div class="text-label">Full Path Text:</div>
    <div class="text-content">
      {#if $selectedPath}
        {$selectedPath}
      {:else}
        <span class="empty">(empty)</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .left-panel {
    width: 100%;
    height: 100%;
    padding: 2rem;
    overflow-y: auto;
    background: #1a1a1a;
  }

  .panel-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #4a9eff;
  }

  .tree-info {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #2a2a2a;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    color: #e0e0e0;
  }

  .stat {
    margin-top: 0.5rem;
  }

  .text-view {
    line-height: 1.8;
    font-size: 1rem;
  }

  .text-label {
    color: #4a9eff;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .text-content {
    color: #e0e0e0;
    white-space: pre-wrap;
  }

  .empty {
    color: #666;
    font-style: italic;
  }

  /* Scrollbar styling */
  :global(.left-panel::-webkit-scrollbar) {
    width: 8px;
  }

  :global(.left-panel::-webkit-scrollbar-track) {
    background: #1a1a1a;
  }

  :global(.left-panel::-webkit-scrollbar-thumb) {
    background: #3a3a3a;
    border-radius: 4px;
  }

  :global(.left-panel::-webkit-scrollbar-thumb:hover) {
    background: #4a4a4a;
  }
</style>
