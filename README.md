# Athanor Loom

A branching interface for base language models. Generate multiple completions from any point, navigate probability space, and curate outputs through slow, deliberate transformation.

## What is Athanor Loom?

Athanor Loom is a visual, browser-based tool for exploring the generative potential of base language models through branching trees of completions. Instead of a single linear conversation, you create a tree where every node can spawn multiple alternative continuations, allowing you to explore the probability space of model outputs.

## Key Features

- **Visual Tree Interface**: See your branching generations as an interactive tree diagram
- **Multiple Completions**: Generate 3, 5, or 7 alternative continuations from any node
- **Full-Path Viewing**: Click any node to see the complete text from root to that point
- **Editable Nodes**: Manually edit any generated text
- **Branch Management**: Delete nodes, prune branches, or generate more children
- **Local Storage**: All trees saved as JSON files on your filesystem
- **OpenRouter Integration**: Works with any base model available on OpenRouter
- **Parameter Control**: Adjust temperature, max_tokens, and other generation parameters
- **Search**: Find text across your entire tree
- **Dark Mode**: Beautiful dark interface by default

## Core Philosophy

Traditional language model interfaces present a single path through probability space. Athanor Loom embraces multiplicity:

- **Branching over Linear**: Every node is a decision point that can spawn alternatives
- **Exploration over Efficiency**: Take time to explore different directions
- **Curation over Acceptance**: Shape and select outputs deliberately
- **Base Models over Chat**: Work with raw generative capabilities, not instruction-tuned assistants

## Quick Start

1. Clone this repository
2. Open `index.html` in your browser (double-click the file)
3. Open settings and enter your OpenRouter API key
4. Enter a base model name (e.g., `meta-llama/llama-3.1-8b-instruct`)
5. Type your initial text in the seed node
6. Click "Generate 3" to create your first branches
7. Click any node to view the full text path
8. Continue branching to explore probability space

## Why "Athanor Loom"?

An **athanor** is an alchemical furnace designed for slow, steady transformation. A **loom** weaves threads into fabric. Together, they represent the essence of this tool: slow, deliberate transformation through weaving probabilistic threads into curated text.

## Documentation

- [**Core Concepts**](CONCEPTS.md) - Understanding trees, nodes, and branching
- [**User Guide**](USER_GUIDE.md) - Detailed interface instructions
- [**Architecture**](ARCHITECTURE.md) - Technical design and implementation
- [**OpenRouter Integration**](API_INTEGRATION.md) - How the API connection works
- [**File Format**](FILE_FORMAT.md) - JSON tree structure specification
- [**Development Guide**](DEVELOPMENT.md) - Tech stack and contribution guidelines

## Use Cases

- **Creative Writing**: Explore multiple narrative directions simultaneously
- **Content Generation**: Generate and compare variations of text
- **Model Behavior Study**: Understand how base models continue text
- **Prompt Engineering**: Test how different starting points lead to different outcomes
- **Text Refinement**: Iteratively improve outputs through branching and editing

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- OpenRouter API key ([get one here](https://openrouter.ai/))
- Internet connection for API calls

## Project Status

Athanor Loom is in active development. This documentation represents the design specification for implementation.

## License

See [LICENSE](LICENSE) for details.

## Contributing

We welcome contributions! See [DEVELOPMENT.md](DEVELOPMENT.md) for guidelines.
