# AI Provider Setup Guide

This guide covers setting up different AI providers for contract generation in development and production environments.

## 🎯 Automatic Configuration

The app automatically configures AI providers based on the environment:

- **🟢 Development**: Uses **Ollama** (free, local)
- **🔴 Production**: Uses **OpenAI** (paid, cloud)

No configuration needed! The app detects the environment and chooses the appropriate provider.

## 🚀 Quick Start (One Command Setup)

### Option 1: Development Setup Script (Recommended)

```bash
# Setup everything and start development server
npm run dev:setup

# Or use the script directly
./scripts/dev-setup.sh
```

This single command will:

- Install Ollama (if not already installed)
- Pull the llama3.2:3b model
- Create `.env.local` with development settings
- Install Node.js dependencies
- Start Ollama service
- Start the development server

### Option 2: Production Deployment Script

```bash
# Setup and build for production
npm run prod:deploy

# Or use the script directly
./scripts/prod-deploy.sh
```

This will:

- Install production dependencies
- Run tests and linting
- Build the application
- Show deployment instructions

### Option 3: Step-by-step Setup

#### 1. Development Setup (Free)

##### Option A: Ollama (Recommended)

```bash
# Run the setup script
./scripts/setup-ollama.sh

# Start your dev server
npm run dev
```

The setup script will:

- Install Ollama
- Pull the llama3.2:3b model
- Create `.env.local` with development settings
- Start Ollama service

##### Option B: Manual Ollama Setup

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.2:3b

# Start Ollama
ollama serve
```

#### 2. Production Setup (Paid)

For production deployment, the app automatically uses OpenAI. Just set your API key:

```env
# Production environment variables
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
```

## 📋 Script Commands

### Development Script (`scripts/dev-setup.sh`)

```bash
# Setup and start development server
npm run dev:setup
# or
./scripts/dev-setup.sh
```

### Production Script (`scripts/prod-deploy.sh`)

```bash
# Setup and build for production
npm run prod:deploy
# or
./scripts/prod-deploy.sh
```

## Environment Configuration

### Development (`.env.local`)

```env
# Ollama Configuration (auto-detected in dev)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# Optional: Override to use OpenAI in dev
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key
```

### Production (Environment Variables)

```env
# OpenAI Configuration (auto-detected in production)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4

# Optional: Override to use different provider
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Provider Comparison

| Provider      | Dev Cost     | Prod Cost | Speed   | Quality   | Setup |
| ------------- | ------------ | --------- | ------- | --------- | ----- |
| **Ollama**    | 🟢 Free      | 🟢 Free   | Medium  | Good      | Low   |
| **OpenAI**    | 🟡 Free tier | 🔴 Paid   | Fast    | Excellent | Low   |
| **Anthropic** | 🟡 Free tier | 🔴 Paid   | Fast    | Excellent | Low   |
| **Mock**      | 🟢 Free      | 🟢 Free   | Instant | Basic     | None  |

## Model Recommendations

### Development (Free)

- **llama3.2:3b** - Fast, good for testing
- **mistral:7b** - Better quality, still free
- **codellama:7b** - Good for structured output

### Production (Paid)

- **gpt-4** - Best quality, reliable
- **claude-3-sonnet** - Excellent quality, good reasoning
- **llama3.2:7b** - Good quality, self-hosted option

## Manual Override

You can override the automatic configuration by setting `AI_PROVIDER`:

```env
# Force OpenAI in development
AI_PROVIDER=openai

# Force Ollama in production
AI_PROVIDER=ollama

# Use mock for testing
AI_PROVIDER=mock
```

## Troubleshooting

### Ollama Issues

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve

# Check available models
ollama list
```

### Rate Limits

- **OpenAI**: 3 requests per minute (free tier)
- **Anthropic**: 5 requests per minute (free tier)
- **Ollama**: No rate limits

### Performance Tips

- Use smaller models (3B) for development
- Use larger models (7B+) for production
- Consider model quantization for faster inference

## Security Considerations

### Development

- Use local Ollama for sensitive data
- Mock provider for testing without API calls
- No API keys needed for local development

### Production

- Secure API key storage
- Rate limiting and monitoring
- Consider self-hosted solutions for data privacy
- Implement proper error handling and fallbacks

## Cost Analysis

### Development (Free)

- Ollama: $0 (self-hosted)
- Mock: $0
- OpenAI free tier: $0 (limited)

### Production (Monthly estimates)

- OpenAI GPT-4: $0.03-0.06 per 1K tokens
- Anthropic Claude: $0.015-0.075 per 1K tokens
- Self-hosted Ollama: $0 (infrastructure costs only)

## Deployment

### Vercel/Netlify

```env
# Production environment variables
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
```

### Self-hosted with Ollama

```env
# Production with self-hosted Ollama
AI_PROVIDER=ollama
OLLAMA_URL=https://your-ollama-instance.com
OLLAMA_MODEL=llama3.2:7b
```

## Next Steps

1. **For Development**: Run `npm run dev:setup` (one command setup)
2. **For Production**: Run `npm run prod:deploy` and set `OPENAI_API_KEY` environment variable
3. **For Testing**: Use `AI_PROVIDER=mock`

The unified API (`/api/generate-contract-unified`) automatically handles all providers, so you can switch between them without changing your frontend code.
