import { Tree, Node } from './tree.js';

// ===== Global Tree Instance =====
let loomTree = null;

// ===== Initialize on Page Load =====
function initializeLoom() {
  console.log('=== Athanor Loom Initializing ===');

  loomTree = new Tree();
  loomTree.initialize('Once upon a time');

  console.log('Tree stats:', loomTree.getStats());
  console.log('Root node full path:', loomTree.getFullPath(loomTree.rootId));

  // Expose to window for testing in console
  window.loomTree = loomTree;
  window.Node = Node;
  window.Tree = Tree;

  console.log('=== Athanor Loom Ready ===');
  console.log('Test commands:');
  console.log('  loomTree.getStats() - View tree statistics');
  console.log('  loomTree.addChildNode(loomTree.rootId, "new text") - Add a child');
  console.log('  loomTree.getFullPath(nodeId) - Get full text path');
  console.log('  loomTree.toJSON() - Export tree to JSON');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLoom);
} else {
  initializeLoom();
}

// Export for potential use by other modules
export { loomTree };
