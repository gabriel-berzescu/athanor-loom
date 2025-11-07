// ===== UI State Store =====
// Manages UI-specific state separate from tree data
// See ARCHITECTURE.md for state management design

import { writable } from 'svelte/store';

// Settings drawer open/closed state
export const drawerOpen = writable(false);

// Search term for finding nodes
export const searchTerm = writable('');

// Array of node IDs currently being generated (loading state)
export const loadingNodes = writable([]);

// Zoom level for tree visualization
export const zoom = writable(1.0);

// Pan offset for tree visualization
export const panOffset = writable({ x: 0, y: 0 });

// Array of node IDs that match the current search
export const matchingNodes = writable([]);

// Array of collapsed node IDs (for hiding their descendants)
export const collapsedNodes = writable([]);
