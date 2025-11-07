import { Tree, Node } from './tree.js';

// ===== Global Tree Instance =====
let loomTree = null;

// ===== UI Elements =====
let textViewElement = null;
let treeInfoElement = null;

// ===== Initialize on Page Load =====
function initializeLoom() {
  console.log('=== Athanor Loom Initializing ===');

  loomTree = new Tree();
  loomTree.initialize('Once upon a time');

  console.log('Tree stats:', loomTree.getStats());
  console.log('Root node full path:', loomTree.getFullPath(loomTree.rootId));

  // Initialize UI
  setupUI();
  updateDisplay();

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

// ===== UI Setup =====
function setupUI() {
  const leftPanel = document.querySelector('.left-panel');
  const panelContent = leftPanel.querySelector('.panel-content');

  // Create tree info section
  treeInfoElement = document.createElement('div');
  treeInfoElement.style.marginBottom = '1.5rem';
  treeInfoElement.style.padding = '1rem';
  treeInfoElement.style.background = '#2a2a2a';
  treeInfoElement.style.borderRadius = '0.5rem';
  treeInfoElement.style.fontSize = '0.9rem';

  // Create text view section
  textViewElement = document.createElement('div');
  textViewElement.style.lineHeight = '1.8';
  textViewElement.style.fontSize = '1rem';

  // Create controls section
  const controlsElement = document.createElement('div');
  controlsElement.style.marginTop = '1.5rem';
  controlsElement.style.display = 'flex';
  controlsElement.style.gap = '0.5rem';

  const addChildButton = document.createElement('button');
  addChildButton.textContent = 'Add Child to Selected';
  addChildButton.style.padding = '0.5rem 1rem';
  addChildButton.style.background = '#4a9eff';
  addChildButton.style.color = 'white';
  addChildButton.style.border = 'none';
  addChildButton.style.borderRadius = '0.25rem';
  addChildButton.style.cursor = 'pointer';
  addChildButton.style.fontSize = '0.9rem';
  addChildButton.addEventListener('click', handleAddChild);

  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export JSON';
  exportButton.style.padding = '0.5rem 1rem';
  exportButton.style.background = '#666';
  exportButton.style.color = 'white';
  exportButton.style.border = 'none';
  exportButton.style.borderRadius = '0.25rem';
  exportButton.style.cursor = 'pointer';
  exportButton.style.fontSize = '0.9rem';
  exportButton.addEventListener('click', handleExport);

  controlsElement.appendChild(addChildButton);
  controlsElement.appendChild(exportButton);

  // Replace panel content
  panelContent.innerHTML = '';
  panelContent.appendChild(treeInfoElement);
  panelContent.appendChild(textViewElement);
  panelContent.appendChild(controlsElement);
}

// ===== Update Display =====
function updateDisplay() {
  if (!loomTree || !textViewElement || !treeInfoElement) return;

  const stats = loomTree.getStats();
  const selectedNode = loomTree.getNode(loomTree.selectedNodeId);
  const fullPath = loomTree.getFullPath(loomTree.selectedNodeId);

  // Update tree info
  treeInfoElement.innerHTML = `
    <div><strong>Tree Statistics</strong></div>
    <div style="margin-top: 0.5rem;">Total Nodes: ${stats.totalNodes}</div>
    <div>Selected Node: ${selectedNode ? selectedNode.id.substring(0, 16) + '...' : 'None'}</div>
  `;

  // Update text view
  textViewElement.innerHTML = `
    <div style="color: #4a9eff; font-weight: 600; margin-bottom: 0.5rem;">Full Path Text:</div>
    <div style="color: #e0e0e0; white-space: pre-wrap;">${fullPath || '(empty)'}</div>
  `;

  console.log('Display updated');
}

// ===== Event Handlers =====
function handleAddChild() {
  if (!loomTree.selectedNodeId) {
    alert('No node selected');
    return;
  }

  const newText = prompt('Enter text for new child node:', ' and they lived happily ever after.');
  if (newText === null) return; // User cancelled

  const newNode = loomTree.addChildNode(loomTree.selectedNodeId, newText);
  if (newNode) {
    loomTree.selectedNodeId = newNode.id; // Select the newly created node
  }
  updateDisplay();

  console.log('Child added. New tree stats:', loomTree.getStats());
}

function handleExport() {
  const json = loomTree.toJSON();
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLoom);
} else {
  initializeLoom();
}

// Export for potential use by other modules
export { loomTree };
