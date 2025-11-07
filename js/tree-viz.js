// ===== Tree Visualization Module =====
// Simple SVG-based tree renderer

export class TreeVisualizer {
  constructor(containerElement) {
    this.container = containerElement;
    this.svg = null;
    this.onNodeClick = null;
    this.nodeRadius = 30;
    this.levelHeight = 100;
    this.nodeSpacing = 80;
  }

  // Initialize SVG element
  initialize() {
    this.container.innerHTML = '';

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.style.width = '100%';
    this.svg.style.height = '100%';
    this.svg.style.minHeight = '400px';

    this.container.appendChild(this.svg);
  }

  // Render the tree
  render(tree, selectedNodeId) {
    if (!this.svg) {
      this.initialize();
    }

    // Clear previous content
    this.svg.innerHTML = '';

    if (!tree || !tree.rootId) {
      return;
    }

    // Calculate tree layout
    const layout = this.calculateLayout(tree);

    // Find SVG dimensions needed
    const bounds = this.calculateBounds(layout);
    const padding = 50;
    const viewBoxWidth = bounds.maxX - bounds.minX + padding * 2;
    const viewBoxHeight = bounds.maxY - bounds.minY + padding * 2;

    this.svg.setAttribute('viewBox',
      `${bounds.minX - padding} ${bounds.minY - padding} ${viewBoxWidth} ${viewBoxHeight}`);

    // Draw edges first (so they appear behind nodes)
    this.drawEdges(tree, layout);

    // Draw nodes
    this.drawNodes(tree, layout, selectedNodeId);
  }

  // Calculate layout positions for all nodes
  // Root at bottom, children grow upward (negative Y)
  calculateLayout(tree) {
    const layout = new Map();
    const levelWidths = new Map();

    // Calculate positions using breadth-first traversal
    const queue = [{ nodeId: tree.rootId, level: 0, indexInLevel: 0 }];

    // First pass: count nodes at each level
    const visited = new Set();
    const tempQueue = [{ nodeId: tree.rootId, level: 0 }];

    while (tempQueue.length > 0) {
      const { nodeId, level } = tempQueue.shift();

      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const currentCount = levelWidths.get(level) || 0;
      levelWidths.set(level, currentCount + 1);

      const node = tree.getNode(nodeId);
      if (node && node.children) {
        node.children.forEach(childId => {
          tempQueue.push({ nodeId: childId, level: level + 1 });
        });
      }
    }

    // Second pass: assign positions
    const levelCounters = new Map();
    visited.clear();

    while (queue.length > 0) {
      const { nodeId, level } = queue.shift();

      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const indexInLevel = levelCounters.get(level) || 0;
      levelCounters.set(level, indexInLevel + 1);

      const nodesInLevel = levelWidths.get(level) || 1;
      const totalWidth = (nodesInLevel - 1) * this.nodeSpacing;
      const startX = -totalWidth / 2;

      // Negative Y so tree grows upward from root
      layout.set(nodeId, {
        x: startX + indexInLevel * this.nodeSpacing,
        y: -level * this.levelHeight
      });

      const node = tree.getNode(nodeId);
      if (node && node.children) {
        node.children.forEach(childId => {
          queue.push({ nodeId: childId, level: level + 1 });
        });
      }
    }

    return layout;
  }

  // Calculate bounds of the layout
  calculateBounds(layout) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    layout.forEach(pos => {
      minX = Math.min(minX, pos.x - this.nodeRadius);
      maxX = Math.max(maxX, pos.x + this.nodeRadius);
      minY = Math.min(minY, pos.y - this.nodeRadius);
      maxY = Math.max(maxY, pos.y + this.nodeRadius);
    });

    return { minX, maxX, minY, maxY };
  }

  // Draw edges between nodes
  // Lines go from parent (lower) to child (higher/upward)
  drawEdges(tree, layout) {
    tree.nodes.forEach((node, nodeId) => {
      if (node.parent) {
        const startPos = layout.get(node.parent);
        const endPos = layout.get(nodeId);

        if (startPos && endPos) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          // Parent is below (higher Y), child is above (lower Y)
          line.setAttribute('x1', startPos.x);
          line.setAttribute('y1', startPos.y - this.nodeRadius); // From top of parent
          line.setAttribute('x2', endPos.x);
          line.setAttribute('y2', endPos.y + this.nodeRadius); // To bottom of child
          line.setAttribute('stroke', '#3a3a3a');
          line.setAttribute('stroke-width', '2');

          this.svg.appendChild(line);
        }
      }
    });
  }

  // Draw nodes
  drawNodes(tree, layout, selectedNodeId) {
    tree.nodes.forEach((node, nodeId) => {
      const pos = layout.get(nodeId);
      if (!pos) return;

      const isSelected = nodeId === selectedNodeId;
      const hasChildren = node.children && node.children.length > 0;

      // Create group for node
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.style.cursor = 'pointer';

      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pos.x);
      circle.setAttribute('cy', pos.y);
      circle.setAttribute('r', this.nodeRadius);
      circle.setAttribute('fill', isSelected ? '#ff6b6b' : '#4a9eff');
      circle.setAttribute('stroke', isSelected ? '#ffffff' : '#2a2a2a');
      circle.setAttribute('stroke-width', isSelected ? '3' : '2');

      // Node label (show first few characters)
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', pos.x);
      label.setAttribute('y', pos.y);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('fill', '#ffffff');
      label.setAttribute('font-size', '12');
      label.setAttribute('font-weight', '600');
      label.setAttribute('pointer-events', 'none');

      const labelText = node.text.trim().substring(0, 8) || '…';
      label.textContent = labelText;

      // Child count indicator (shown above node since children grow upward)
      if (hasChildren) {
        const badge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        badge.setAttribute('cx', pos.x + this.nodeRadius * 0.7);
        badge.setAttribute('cy', pos.y - this.nodeRadius * 0.7);
        badge.setAttribute('r', '10');
        badge.setAttribute('fill', '#2a2a2a');
        badge.setAttribute('stroke', '#4a9eff');
        badge.setAttribute('stroke-width', '2');

        const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badgeText.setAttribute('x', pos.x + this.nodeRadius * 0.7);
        badgeText.setAttribute('y', pos.y - this.nodeRadius * 0.7);
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.setAttribute('dominant-baseline', 'middle');
        badgeText.setAttribute('fill', '#ffffff');
        badgeText.setAttribute('font-size', '10');
        badgeText.setAttribute('font-weight', 'bold');
        badgeText.setAttribute('pointer-events', 'none');
        badgeText.textContent = node.children.length;

        group.appendChild(badge);
        group.appendChild(badgeText);
      }

      group.appendChild(circle);
      group.appendChild(label);

      // Click handler
      group.addEventListener('click', () => {
        if (this.onNodeClick) {
          this.onNodeClick(nodeId);
        }
      });

      // Hover effect
      group.addEventListener('mouseenter', () => {
        circle.setAttribute('opacity', '0.8');
      });
      group.addEventListener('mouseleave', () => {
        circle.setAttribute('opacity', '1');
      });

      this.svg.appendChild(group);
    });
  }
}
