# OpenRouter API Integration

How Athanor Loom integrates with OpenRouter for language model generation.

## What is OpenRouter?

[OpenRouter](https://openrouter.ai/) is an API gateway that provides access to multiple language models through a unified interface. Instead of managing separate API keys for OpenAI, Anthropic, Meta, etc., you use one OpenRouter key to access all models.

## Why OpenRouter?

- **Unified API**: One interface for many models
- **Base model support**: Access to raw base models, not just chat-tuned
- **Model variety**: Switch between models without code changes
- **Cost effective**: Competitive pricing across providers
- **Simple**: No complex authentication or provider-specific quirks

## API Endpoint

OpenRouter provides a OpenAI-compatible endpoint:

```
https://openrouter.ai/api/v1/chat/completions
```

However, for **base models** (non-chat), we need to use text completion, not chat completion.

## Base Models vs Chat Models

### Chat Models
- Expect structured messages: `[{role: "user", content: "..."}, ...]`
- Have system prompts
- Trained to follow instructions
- Examples: GPT-4, Claude, Llama-3-Instruct

### Base Models
- Expect raw text input
- No roles or structure
- Just continue the text
- Examples: GPT-2, Llama-3-base, Falcon

Athanor Loom uses **base models** exclusively.

## API Request Format

### Endpoint

OpenRouter supports text completion through their completions endpoint or by using the chat endpoint with a single "user" message containing the raw text.

**Recommended approach**: Use the chat completions endpoint with a single message.

### Request Structure

```javascript
{
  "model": "meta-llama/llama-3.1-8b-instruct",  // Model identifier
  "messages": [
    {
      "role": "user",
      "content": "The old lighthouse keeper had a secret."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 256,
  "top_p": 0.9,
  "top_k": 40,
  "frequency_penalty": 0.0,
  "presence_penalty": 0.0,
  "n": 1  // Number of completions
}
```

### Headers

```javascript
{
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json",
  "HTTP-Referer": "https://athanor-loom.app",  // Optional, for analytics
  "X-Title": "Athanor Loom"  // Optional, for analytics
}
```

## Making Requests

### Single Completion

```javascript
async function generateCompletion(promptText, settings) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${settings.api.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Athanor Loom'
    },
    body: JSON.stringify({
      model: settings.api.modelName,
      messages: [
        {
          role: "user",
          content: promptText
        }
      ],
      temperature: settings.generation.temperature,
      max_tokens: settings.generation.maxTokens,
      top_p: settings.generation.topP,
      top_k: settings.generation.topK,
      frequency_penalty: settings.generation.frequencyPenalty,
      presence_penalty: settings.generation.presencePenalty,
      n: 1
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### Multiple Completions

For generating multiple children (e.g., 3, 5, or 7 alternatives), we make **parallel requests**:

```javascript
async function generateMultipleCompletions(promptText, count, settings) {
  const promises = Array(count).fill().map(() =>
    generateCompletion(promptText, settings)
  );

  try {
    const completions = await Promise.all(promises);
    return completions;
  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
}
```

**Why parallel requests instead of `n: 3`?**
- Some models don't support `n > 1`
- Parallel requests give more control
- Can handle partial failures better
- Progress feedback per request

## Response Format

```json
{
  "id": "gen-abc123",
  "model": "meta-llama/llama-3.1-8b-instruct",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": " He kept a journal of every ship that passed..."
      },
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 256,
    "total_tokens": 298
  }
}
```

Extract the generated text:
```javascript
const generatedText = data.choices[0].message.content;
```

## Error Handling

### Common Errors

**401 Unauthorized**:
- Invalid API key
- Show: "Invalid API key. Check settings."

**402 Payment Required**:
- Insufficient credits
- Show: "Insufficient credits. Add credits to OpenRouter."

**429 Too Many Requests**:
- Rate limited
- Retry with exponential backoff

**500 Internal Server Error**:
- OpenRouter or model provider issue
- Show: "API error. Try again later."

**Model Not Found**:
- Invalid model name
- Show: "Model not found. Check model name in settings."

### Error Handler

```javascript
async function handleAPIError(response) {
  const error = await response.json();

  switch (response.status) {
    case 401:
      return "Invalid API key. Check settings.";
    case 402:
      return "Insufficient credits. Add credits to OpenRouter.";
    case 429:
      return "Rate limited. Please wait and try again.";
    case 500:
      return "API error. Try again later.";
    default:
      return error.error?.message || "Unknown error occurred.";
  }
}
```

### Retry Logic

For transient errors (500, 429), implement retry:

```javascript
async function generateWithRetry(promptText, settings, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateCompletion(promptText, settings);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

## Model Selection

### Recommended Base Models

OpenRouter offers many models. Good base models for Athanor Loom:

**Small/Fast**:
- `meta-llama/llama-3.1-8b-instruct`
- `mistralai/mistral-7b-instruct`
- `google/gemma-7b-it`

**Medium**:
- `meta-llama/llama-3.1-70b-instruct`
- `mistralai/mixtral-8x7b-instruct`

**Large/Powerful**:
- `meta-llama/llama-3.1-405b-instruct`
- `anthropic/claude-3-opus` (if base mode available)

**Note**: Some models listed as "instruct" can still be used in a base-like manner by providing raw text continuation prompts.

### Model Naming

OpenRouter uses the format: `provider/model-name`

Examples:
- `meta-llama/llama-3.1-8b-instruct`
- `mistralai/mistral-7b-instruct`
- `openai/gpt-3.5-turbo`

Check [OpenRouter models page](https://openrouter.ai/models) for the full list.

### Model Parameters

Different models support different parameters:

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| temperature | Randomness | 0.0 - 2.0 |
| max_tokens | Output length | 1 - 4096+ |
| top_p | Nucleus sampling | 0.0 - 1.0 |
| top_k | Top-k sampling | 0 - 100 |
| frequency_penalty | Reduce repetition | -2.0 - 2.0 |
| presence_penalty | Encourage novelty | -2.0 - 2.0 |

Not all models support all parameters. OpenRouter will ignore unsupported ones.

## API Key Management

### Getting an API Key

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Create a new key
5. Add credits to your account

### Storing the Key

**In Athanor Loom**:
- Store in `localStorage` (browser storage)
- Never include in tree JSON files
- Never commit to version control
- User enters in settings drawer

```javascript
// Save
localStorage.setItem('loom-api-key', apiKey);

// Load
const apiKey = localStorage.getItem('loom-api-key');
```

### Security Warning

API keys in `localStorage` are vulnerable if:
- User has malicious browser extensions
- XSS vulnerability in the app
- Someone has physical access to the device

For Athanor Loom (a local-first tool), this is acceptable. Users should:
- Use API keys with spending limits
- Not share their device
- Keep browser secure

## Rate Limiting

OpenRouter has rate limits to prevent abuse:

- **Requests per minute**: Varies by plan
- **Concurrent requests**: Usually 5-10

For Athanor Loom's "Generate 3/5/7" feature:
- 3 parallel requests: Usually fine
- 5 parallel requests: Usually fine
- 7 parallel requests: May hit limits on free tier

If rate limited, show error and let user retry.

## Cost Tracking

Each model has different pricing. Users can check:
- [OpenRouter pricing](https://openrouter.ai/models)
- OpenRouter dashboard for usage

Athanor Loom doesn't track costs directly (would require backend), but users can:
- Monitor on OpenRouter dashboard
- Set spending limits on their account
- Choose cheaper models for experimentation

## Streaming (Optional)

OpenRouter supports streaming responses:

```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { ... },
  body: JSON.stringify({
    ...params,
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      const token = data.choices[0]?.delta?.content;
      if (token) {
        // Update UI with token
      }
    }
  }
}
```

**For Athanor Loom**: Streaming is optional. Non-streaming is simpler and works well for moderate-length generations.

## Testing API Integration

### Test Endpoint

Before implementing full tree logic, test the API:

```javascript
// Simple test
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'meta-llama/llama-3.1-8b-instruct',
    messages: [{ role: 'user', content: 'Once upon a time' }],
    max_tokens: 50
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Mock API for Development

During development, mock the API to avoid costs:

```javascript
async function generateCompletion(promptText, settings) {
  if (settings.api.mockMode) {
    // Return fake completion
    await new Promise(resolve => setTimeout(resolve, 1000));
    return " [Generated text based on: " + promptText.slice(-50) + "]";
  }

  // Real API call
  // ...
}
```

## OpenRouter Alternatives

If OpenRouter doesn't work, alternatives:

- **Direct provider APIs**: OpenAI, Anthropic, etc.
- **Together AI**: Similar to OpenRouter
- **Replicate**: Model marketplace
- **Local models**: Ollama, LM Studio (requires backend)

Athanor Loom is designed for OpenRouter, but the API client could be swapped.

## API Integration Checklist

- [ ] API key input in settings
- [ ] API key stored in localStorage
- [ ] Model name input in settings
- [ ] Parameter controls (temperature, max_tokens, etc.)
- [ ] Fetch API client
- [ ] Error handling for all status codes
- [ ] Retry logic for transient errors
- [ ] Loading indicators during generation
- [ ] Parallel request handling
- [ ] Response parsing
- [ ] User-friendly error messages

## Example Full Implementation

```javascript
// api.js
export class OpenRouterClient {
  constructor(apiKey, modelName) {
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.baseUrl = 'https://openrouter.ai/api/v1';
  }

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

  async generateMultiple(promptText, count, params) {
    const promises = Array(count).fill().map(() =>
      this.generateCompletion(promptText, params)
    );
    return Promise.all(promises);
  }

  async handleError(response) {
    const error = await response.json();
    switch (response.status) {
      case 401: return 'Invalid API key';
      case 402: return 'Insufficient credits';
      case 429: return 'Rate limited';
      case 500: return 'API error';
      default: return error.error?.message || 'Unknown error';
    }
  }
}
```

## Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)
- [OpenRouter API Keys](https://openrouter.ai/keys)
- [OpenRouter Pricing](https://openrouter.ai/models)
