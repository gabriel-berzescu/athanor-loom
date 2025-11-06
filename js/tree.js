// ===== Node Class =====
export class Node {
  constructor(text, parentId = null) {
    this.id = this.generateId();
    this.text = text;
    this.parentId = parentId;
    this.childrenIds = [];
    this.createdAt = new Date().toISOString();
  }

  generateId() {
    return 'node_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  addChild(childId) {
    if (!this.childrenIds.includes(childId)) {
      this.childrenIds.push(childId);
    }
  }

  removeChild(childId) {
    this.childrenIds = this.childrenIds.filter(id => id !== childId);
  }
}

// ===== Tree Class =====
export class Tree {
  constructor() {
    this.nodes = new Map();
    this.rootId = null;
    this.selectedNodeId = null;
  }

  // Initialize tree with a root node
  initialize(seedText = '') {
    const rootNode = new Node(seedText, null);
    this.nodes.set(rootNode.id, rootNode);
    this.rootId = rootNode.id;
    this.selectedNodeId = rootNode.id;
    console.log('Tree initialized with root node:', rootNode.id);
    return rootNode;
  }

  // Get a node by ID
  getNode(nodeId) {
    return this.nodes.get(nodeId);
  }

  // Add a child node to a parent
  addChildNode(parentId, text) {
    const parent = this.getNode(parentId);
    if (!parent) {
      console.error('Parent node not found:', parentId);
      return null;
    }

    const childNode = new Node(text, parentId);
    this.nodes.set(childNode.id, childNode);
    parent.addChild(childNode.id);

    console.log('Added child node:', childNode.id, 'to parent:', parentId);
    return childNode;
  }

  // Get the full text path from root to a specific node
  getFullPath(nodeId) {
    const path = [];
    let currentId = nodeId;

    while (currentId !== null) {
      const node = this.getNode(currentId);
      if (!node) break;
      path.unshift(node.text);
      currentId = node.parentId;
    }

    return path.join('');
  }

  // Get all children of a node
  getChildren(nodeId) {
    const node = this.getNode(nodeId);
    if (!node) return [];
    return node.childrenIds.map(id => this.getNode(id)).filter(n => n !== undefined);
  }

  // Get the parent of a node
  getParent(nodeId) {
    const node = this.getNode(nodeId);
    if (!node || !node.parentId) return null;
    return this.getNode(node.parentId);
  }

  // Delete a node and all its descendants
  deleteNode(nodeId) {
    if (nodeId === this.rootId) {
      console.error('Cannot delete root node');
      return false;
    }

    const node = this.getNode(nodeId);
    if (!node) return false;

    // Recursively delete all children
    const childrenToDelete = [...node.childrenIds];
    childrenToDelete.forEach(childId => this.deleteNode(childId));

    // Remove from parent's children list
    if (node.parentId) {
      const parent = this.getNode(node.parentId);
      if (parent) {
        parent.removeChild(nodeId);
      }
    }

    // Delete the node itself
    this.nodes.delete(nodeId);
    console.log('Deleted node:', nodeId);
    return true;
  }

  // Update node text
  updateNodeText(nodeId, newText) {
    const node = this.getNode(nodeId);
    if (!node) return false;
    node.text = newText;
    console.log('Updated node text:', nodeId);
    return true;
  }

  // Get tree statistics
  getStats() {
    return {
      totalNodes: this.nodes.size,
      rootId: this.rootId,
      selectedNodeId: this.selectedNodeId
    };
  }

  // Export tree to JSON
  toJSON() {
    const nodesArray = Array.from(this.nodes.values());
    return {
      rootId: this.rootId,
      selectedNodeId: this.selectedNodeId,
      nodes: nodesArray,
      exportedAt: new Date().toISOString()
    };
  }

  // Import tree from JSON
  fromJSON(data) {
    this.nodes.clear();
    this.rootId = data.rootId;
    this.selectedNodeId = data.selectedNodeId || data.rootId;

    data.nodes.forEach(nodeData => {
      const node = new Node(nodeData.text, nodeData.parentId);
      node.id = nodeData.id;
      node.childrenIds = nodeData.childrenIds || [];
      node.createdAt = nodeData.createdAt;
      this.nodes.set(node.id, node);
    });

    console.log('Tree imported from JSON:', this.getStats());
  }
}
