<script>
  import { onMount, onDestroy } from 'svelte';
  import cytoscape from 'cytoscape';
  import { tree, selectedNodeId } from '../stores/treeStore.js';

  let container;
  let cy;

  onMount(() => {
    // Initialize Cytoscape
    cy = cytoscape({
      container: container,

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#4a9eff',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#1a1a1a',
            'width': 60,
            'height': 60,
            'font-size': '12px',
            'font-weight': '600'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#3a3a3a',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#3a3a3a'
          }
        },
        {
          selector: '.selected',
          style: {
            'background-color': '#ff6b6b',
            'border-width': 3,
            'border-color': '#fff'
          }
        },
        {
          selector: '.has-children',
          style: {
            'background-color': '#4a9eff',
            'border-width': 2,
            'border-color': '#2a2a2a'
          }
        }
      ],

      layout: {
        name: 'breadthfirst',
        directed: true,
        spacingFactor: 1.5,
        avoidOverlap: true,
        roots: '#root'
      },

      minZoom: 0.3,
      maxZoom: 3
    });

    // Handle node clicks
    cy.on('tap', 'node', (event) => {
      const nodeId = event.target.id();
      selectedNodeId.set(nodeId);
    });

    // Subscribe to tree changes
    const unsubscribe = tree.subscribe($tree => {
      updateVisualization($tree);
    });

    // Subscribe to selection changes
    const unsubscribeSelection = selectedNodeId.subscribe($selectedNodeId => {
      if (cy) {
        cy.nodes().removeClass('selected');
        if ($selectedNodeId) {
          cy.getElementById($selectedNodeId).addClass('selected');
        }
      }
    });

    return () => {
      unsubscribe();
      unsubscribeSelection();
    };
  });

  function updateVisualization(treeInstance) {
    if (!cy || !treeInstance.rootId) return;

    const elements = [];

    // Add all nodes
    treeInstance.nodes.forEach((node, nodeId) => {
      const isRoot = nodeId === treeInstance.rootId;
      const hasChildren = node.children && node.children.length > 0;
      const label = node.text.trim().substring(0, 8) || '…';

      elements.push({
        data: {
          id: nodeId,
          label: hasChildren ? `${label} (${node.children.length})` : label
        },
        classes: [
          isRoot ? 'root' : '',
          hasChildren ? 'has-children' : ''
        ].filter(Boolean).join(' ')
      });

      // Add edges from parent to this node
      if (node.parent) {
        elements.push({
          data: {
            id: `${node.parent}-${nodeId}`,
            source: node.parent,
            target: nodeId
          }
        });
      }
    });

    // Update the graph
    cy.json({ elements });

    // Run layout
    // Use breadthfirst with root at bottom (tree grows upward)
    const layout = cy.layout({
      name: 'breadthfirst',
      directed: true,
      spacingFactor: 1.5,
      avoidOverlap: true,
      roots: `#${treeInstance.rootId}`,
      // Position root at bottom by using positions
      fit: true,
      padding: 50
    });

    layout.run();

    // Flip the layout so root is at bottom
    // Cytoscape's breadthfirst puts root at top by default
    cy.nodes().forEach(node => {
      const pos = node.position();
      node.position({ x: pos.x, y: -pos.y });
    });

    cy.fit(50);
  }

  onDestroy(() => {
    if (cy) {
      cy.destroy();
    }
  });
</script>

<div bind:this={container} class="tree-canvas"></div>

<style>
  .tree-canvas {
    width: 100%;
    height: 100%;
    background: #1a1a1a;
  }
</style>
