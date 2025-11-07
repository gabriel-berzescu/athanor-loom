// ===== File Storage Module =====
// Handle saving/loading tree files and settings
// See FILE_FORMAT.md for JSON structure specification

/**
 * Save tree to a JSON file on the user's filesystem
 * Uses File System Access API when available, falls back to download link
 * @param {Tree} tree - The tree instance to save
 * @param {string} filename - Suggested filename
 */
export async function saveTree(tree, filename = null) {
  const json = tree.toJSON();
  const jsonString = JSON.stringify(json, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  const suggestedName = filename || `loom-tree-${Date.now()}.json`;

  // Modern File System Access API
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [{
          description: 'Loom Tree',
          accept: { 'application/json': ['.json'] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (error) {
      if (error.name === 'AbortError') {
        return false; // User cancelled
      }
      throw error;
    }
  } else {
    // Fallback: Download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = suggestedName;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }
}

/**
 * Load tree from a JSON file
 * Uses File System Access API when available, falls back to file input
 * @returns {Promise<object>} - The parsed tree JSON
 */
export async function loadTree() {
  let json;

  // Modern File System Access API
  if ('showOpenFilePicker' in window) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{
          description: 'Loom Tree',
          accept: { 'application/json': ['.json'] }
        }],
        multiple: false
      });
      const file = await handle.getFile();
      json = await file.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        return null; // User cancelled
      }
      throw error;
    }
  } else {
    // Fallback: File input
    json = await new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        try {
          const file = e.target.files[0];
          if (!file) {
            resolve(null);
            return;
          }
          const text = await file.text();
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  if (!json) return null;

  return JSON.parse(json);
}

/**
 * Save settings to localStorage
 * @param {object} settings - Settings object
 */
export function saveSettings(settings) {
  localStorage.setItem('loom-settings', JSON.stringify(settings));
}

/**
 * Load settings from localStorage
 * @returns {object|null} - Settings object or null if not found
 */
export function loadSettings() {
  const json = localStorage.getItem('loom-settings');
  return json ? JSON.parse(json) : null;
}

/**
 * Get default settings
 * @returns {object} - Default settings object
 */
export function getDefaultSettings() {
  return {
    api: {
      apiKey: '',
      modelName: 'meta-llama/llama-3.1-405b'
    },
    generation: {
      temperature: 0.7,
      maxTokens: 256,
      topP: 0.9,
      topK: 40,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0
    },
    interface: {
      defaultGenerationCount: 3,
      autoSave: false,
      darkMode: true
    }
  };
}

/**
 * Validate tree JSON structure
 * @param {object} tree - The tree JSON to validate
 * @returns {string[]} - Array of error messages (empty if valid)
 */
export function validateTree(tree) {
  const errors = [];

  // Check version
  if (!tree.version) {
    errors.push('Missing version field');
  }

  // Check root exists
  if (!tree.root || !tree.nodes[tree.root]) {
    errors.push('Invalid root node');
  }

  // Check root has no parent
  if (tree.nodes[tree.root]?.parent !== null) {
    errors.push('Root node must have null parent');
  }

  // Check all children exist
  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    for (const childId of node.children || []) {
      if (!tree.nodes[childId]) {
        errors.push(`Node ${nodeId} references non-existent child ${childId}`);
      }
    }
  }

  // Check parent-child relationships match
  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    if (node.parent !== null) {
      const parent = tree.nodes[node.parent];
      if (!parent || !parent.children.includes(nodeId)) {
        errors.push(`Parent-child mismatch for node ${nodeId}`);
      }
    }
  }

  return errors;
}
