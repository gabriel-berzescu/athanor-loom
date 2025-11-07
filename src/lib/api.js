// ===== OpenRouter API Client =====
// API integration for language model generation
// See API_INTEGRATION.md for full specification

export class OpenRouterClient {
  constructor(apiKey, modelName) {
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.baseUrl = 'https://openrouter.ai/api/v1';
  }

  /**
   * Generate a single completion from the language model
   * @param {string} promptText - The text to continue
   * @param {object} params - Generation parameters (temperature, maxTokens, etc.)
   * @returns {Promise<string>} - The generated text
   */
  async generateCompletion(promptText, params) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Athanor Loom'
      },
      body: JSON.stringify({
        model: this.modelName,
        messages: [{ role: 'user', content: promptText }],
        temperature: params.temperature || 0.7,
        max_tokens: params.maxTokens || 256,
        top_p: params.topP || 0.9,
        top_k: params.topK || 40,
        frequency_penalty: params.frequencyPenalty || 0.0,
        presence_penalty: params.presencePenalty || 0.0
      })
    });

    if (!response.ok) {
      throw new Error(await this.handleError(response));
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Generate multiple completions in parallel
   * @param {string} promptText - The text to continue
   * @param {number} count - Number of completions to generate (3, 5, or 7)
   * @param {object} params - Generation parameters
   * @returns {Promise<string[]>} - Array of generated texts
   */
  async generateMultiple(promptText, count, params) {
    const promises = Array(count).fill().map(() =>
      this.generateCompletion(promptText, params)
    );
    return Promise.all(promises);
  }

  /**
   * Handle API errors and return user-friendly messages
   * @param {Response} response - The failed fetch response
   * @returns {Promise<string>} - Error message
   */
  async handleError(response) {
    const error = await response.json();
    switch (response.status) {
      case 401: return 'Invalid API key';
      case 402: return 'Insufficient credits';
      case 429: return 'Rate limited. Please wait and try again.';
      case 500: return 'API error. Try again later.';
      default: return error.error?.message || 'Unknown error';
    }
  }
}
