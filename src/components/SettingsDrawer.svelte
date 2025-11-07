<script>
  import { drawerOpen } from '../stores/uiStore.js';
  import { settings, updateApiSettings, updateGenerationParams, updateInterfaceSettings } from '../stores/settingsStore.js';

  function closeDrawer() {
    drawerOpen.set(false);
  }

  function handleApiKeyChange(event) {
    updateApiSettings({ apiKey: event.target.value });
  }

  function handleModelChange(event) {
    updateApiSettings({ modelName: event.target.value });
  }

  function handleTemperatureChange(event) {
    updateGenerationParams({ temperature: parseFloat(event.target.value) });
  }

  function handleMaxTokensChange(event) {
    updateGenerationParams({ maxTokens: parseInt(event.target.value) });
  }
</script>

{#if $drawerOpen}
  <div class="drawer-backdrop" on:click={closeDrawer}></div>
  <div class="drawer">
    <div class="drawer-header">
      <h2>Settings</h2>
      <button class="close-button" on:click={closeDrawer}>×</button>
    </div>

    <div class="drawer-content">
      <section class="settings-section">
        <h3>API Settings</h3>
        <div class="setting-item">
          <label for="api-key">OpenRouter API Key</label>
          <input
            id="api-key"
            type="password"
            placeholder="sk-or-..."
            value={$settings.api.apiKey}
            on:input={handleApiKeyChange}
          />
          <p class="setting-help">Get your API key from <a href="https://openrouter.ai/keys" target="_blank">OpenRouter</a></p>
        </div>

        <div class="setting-item">
          <label for="model-name">Model Name</label>
          <input
            id="model-name"
            type="text"
            placeholder="meta-llama/llama-3.1-8b-instruct"
            value={$settings.api.modelName}
            on:input={handleModelChange}
          />
          <p class="setting-help">See available models at <a href="https://openrouter.ai/models" target="_blank">OpenRouter Models</a></p>
        </div>
      </section>

      <section class="settings-section">
        <h3>Generation Parameters</h3>
        <div class="setting-item">
          <label for="temperature">
            Temperature: {$settings.generation.temperature}
          </label>
          <input
            id="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={$settings.generation.temperature}
            on:input={handleTemperatureChange}
          />
          <p class="setting-help">Controls randomness (0 = deterministic, 2 = very random)</p>
        </div>

        <div class="setting-item">
          <label for="max-tokens">Max Tokens</label>
          <input
            id="max-tokens"
            type="number"
            min="1"
            max="4096"
            value={$settings.generation.maxTokens}
            on:input={handleMaxTokensChange}
          />
          <p class="setting-help">Maximum length of each generation</p>
        </div>
      </section>

      <section class="settings-section">
        <h3>Interface</h3>
        <div class="setting-item">
          <p class="coming-soon">Additional interface settings coming soon</p>
        </div>
      </section>
    </div>
  </div>
{/if}

<style>
  .drawer-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: #2a2a2a;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #3a3a3a;
  }

  .drawer-header h2 {
    margin: 0;
    color: #4a9eff;
    font-size: 1.5rem;
  }

  .close-button {
    background: none;
    border: none;
    color: #e0e0e0;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .close-button:hover {
    color: #4a9eff;
  }

  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }

  .settings-section {
    margin-bottom: 2rem;
  }

  .settings-section h3 {
    color: #4a9eff;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .setting-item {
    margin-bottom: 1.5rem;
  }

  .setting-item label {
    display: block;
    color: #e0e0e0;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .setting-item input[type="text"],
  .setting-item input[type="password"],
  .setting-item input[type="number"] {
    width: 100%;
    padding: 0.5rem;
    background: #1a1a1a;
    border: 1px solid #3a3a3a;
    border-radius: 0.25rem;
    color: #e0e0e0;
    font-size: 0.9rem;
  }

  .setting-item input[type="range"] {
    width: 100%;
  }

  .setting-help {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: #999;
  }

  .setting-help a {
    color: #4a9eff;
    text-decoration: none;
  }

  .setting-help a:hover {
    text-decoration: underline;
  }

  .coming-soon {
    color: #999;
    font-style: italic;
  }
</style>
