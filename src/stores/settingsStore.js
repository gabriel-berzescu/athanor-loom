// ===== Settings Store =====
// Manages application settings with localStorage persistence
// See ARCHITECTURE.md and API_INTEGRATION.md for settings structure

import { writable } from 'svelte/store';
import { loadSettings, saveSettings, getDefaultSettings } from '../lib/storage.js';

// Default settings structure
const defaultSettings = getDefaultSettings();

// Load settings from localStorage or use defaults
const initialSettings = loadSettings() || defaultSettings;

// Create the writable store
export const settings = writable(initialSettings);

// Auto-save settings to localStorage whenever they change
settings.subscribe(value => {
  saveSettings(value);
});

/**
 * Update API settings
 * @param {object} apiSettings - { apiKey, modelName }
 */
export function updateApiSettings(apiSettings) {
  settings.update(s => ({
    ...s,
    api: { ...s.api, ...apiSettings }
  }));
}

/**
 * Update generation parameters
 * @param {object} genParams - { temperature, maxTokens, topP, etc. }
 */
export function updateGenerationParams(genParams) {
  settings.update(s => ({
    ...s,
    generation: { ...s.generation, ...genParams }
  }));
}

/**
 * Update interface settings
 * @param {object} interfaceSettings - { defaultGenerationCount, autoSave, darkMode }
 */
export function updateInterfaceSettings(interfaceSettings) {
  settings.update(s => ({
    ...s,
    interface: { ...s.interface, ...interfaceSettings }
  }));
}

/**
 * Reset settings to defaults
 */
export function resetSettings() {
  settings.set(getDefaultSettings());
}
