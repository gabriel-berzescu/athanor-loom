import { writable, derived } from 'svelte/store';
import { Tree } from '../lib/tree.js';

// Create the tree store
export const tree = writable(new Tree());

// Currently selected node ID
export const selectedNodeId = writable(null);

// Derived store: get the selected node object
export const selectedNode = derived(
  [tree, selectedNodeId],
  ([$tree, $selectedNodeId]) => {
    return $selectedNodeId ? $tree.getNode($selectedNodeId) : null;
  }
);

// Derived store: get the full path text from root to selected node
export const selectedPath = derived(
  [tree, selectedNodeId],
  ([$tree, $selectedNodeId]) => {
    return $selectedNodeId ? $tree.getFullPath($selectedNodeId) : '';
  }
);

// Initialize the tree with a root node
export function initializeTree(seedText = 'Once upon a time') {
  tree.update(t => {
    t.initialize(seedText);
    selectedNodeId.set(t.rootId);
    return t;
  });
}

// Add a child node to the selected node
export function addChildToSelected(text) {
  let newNodeId = null;

  tree.update(t => {
    const currentSelected = selectedNodeId;
    let parentId;

    currentSelected.subscribe(id => parentId = id)();

    if (parentId) {
      const newNode = t.addChildNode(parentId, text);
      if (newNode) {
        newNodeId = newNode.id;
      }
    }

    return t;
  });

  if (newNodeId) {
    selectedNodeId.set(newNodeId);
  }
}
