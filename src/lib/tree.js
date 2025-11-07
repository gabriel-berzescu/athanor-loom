// ===== Node Class =====
export class Node {
  constructor(text, parentId = null, metadata = {}) {
    this.id = this.generateId();
    this.text = text;
    this.parent = parentId;
    this.children = [];
    this.collapsed = false;
    this.metadata = {
      created: new Date().toISOString(),
      model: metadata.model || null,
      temperature: metadata.temperature || null,
      maxTokens: metadata.maxTokens || null,
      topP: metadata.topP || null,
      topK: metadata.topK || null,
      frequencyPenalty: metadata.frequencyPenalty || null,
      presencePenalty: metadata.presencePenalty || null,
      edited: false,
      editedAt: null
    };
  }

  generateId() {
    // Use UUID v4 as per spec
    return crypto.randomUUID();
  }

  addChild(childId) {
    if (!this.children.includes(childId)) {
      this.children.push(childId);
    }
  }

  removeChild(childId) {
    this.children = this.children.filter(id => id !== childId);
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
      currentId = node.parent;
    }

    return path.join('');
  }

  // Get all children of a node
  getChildren(nodeId) {
    const node = this.getNode(nodeId);
    if (!node) return [];
    return node.children.map(id => this.getNode(id)).filter(n => n !== undefined);
  }

  // Get the parent of a node
  getParent(nodeId) {
    const node = this.getNode(nodeId);
    if (!node || !node.parent) return null;
    return this.getNode(node.parent);
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
    const childrenToDelete = [...node.children];
    childrenToDelete.forEach(childId => this.deleteNode(childId));

    // Remove from parent's children list
    if (node.parent) {
      const parent = this.getNode(node.parent);
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

  // Export tree to JSON (matches FILE_FORMAT.md spec)
  toJSON() {
    const nodesObject = {};

    // Convert Map to object with node IDs as keys
    this.nodes.forEach((node, id) => {
      nodesObject[id] = {
        id: node.id,
        text: node.text,
        parent: node.parent,
        children: node.children,
        collapsed: node.collapsed,
        metadata: node.metadata
      };
    });

    return {
      version: '1.0',
      root: this.rootId,
      nodes: nodesObject,
      metadata: {
        created: this.nodes.get(this.rootId)?.metadata.created || new Date().toISOString(),
        modified: new Date().toISOString(),
        totalNodes: this.nodes.size,
        title: null,
        description: null
      }
    };
  }

  // Import tree from JSON (matches FILE_FORMAT.md spec)
  fromJSON(data) {
    this.nodes.clear();
    this.rootId = data.root;
    this.selectedNodeId = data.root;

    // Convert object to Map
    Object.entries(data.nodes).forEach(([id, nodeData]) => {
      const node = new Node(nodeData.text, nodeData.parent);
      node.id = nodeData.id;
      node.children = nodeData.children || [];
      node.collapsed = nodeData.collapsed || false;
      node.metadata = nodeData.metadata || {
        created: new Date().toISOString(),
        model: null,
        temperature: null,
        maxTokens: null,
        edited: false,
        editedAt: null
      };
      this.nodes.set(node.id, node);
    });

    console.log('Tree imported from JSON:', this.getStats());
  }
}
