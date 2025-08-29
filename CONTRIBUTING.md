# Contributing to ContractGPT

Thank you for your interest in contributing! We welcome all kinds of contributions to make ContractGPT better.

## 🚀 Quick Start for Contributors

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/AaravKhanduja/ContractGPT.git
cd contract-gpt

# Setup everything automatically (Ollama + dependencies)
npm run dev:setup

# Start development server
npm run dev
```

This will automatically:

- Install Ollama (free AI model for development)
- Pull the llama3.2:3b model
- Install all dependencies
- Create environment configuration
- Start the development server

### 2. Development Workflow

- **AI Generation**: Uses Ollama (free, local) - no API keys needed
- **Real AI**: All contract generation uses real AI models (no mocks)
- **Hot Reload**: Changes are reflected immediately
- **Testing**: Test with real AI-generated contracts

## 🛠️ How to Contribute

1. **Fork the repository** and clone it to your local machine.
2. **Setup development environment**:
   ```bash
   npm run dev:setup
   ```
3. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b your-feature-name
   ```
4. **Make your changes** and commit them with clear, descriptive messages.
5. **Test your changes** with real AI generation.
6. **Push to your fork** and submit a pull request (PR) to the `main` branch.

## 🧹 Code Style

- Use [Prettier](https://prettier.io/) for code formatting. Code will be auto-formatted on commit.
- Follow the existing code style and conventions.
- Write clear, concise commit messages.
- Remove all debugging `console.log` statements before submitting PRs.

## ✅ Pull Request Guidelines

- Ensure your branch is up to date with `main` before submitting a PR.
- Provide a clear description of your changes and why they are needed.
- Reference related issues or discussions if applicable.
- Add tests for new features or bug fixes when possible.
- Test with real AI generation (no mock contracts).
- Be responsive to feedback and requested changes.

## 🎨 UI/UX Guidelines

### Contract Styling

- Contracts use enhanced styling with professional formatting
- Headers have visual indicators (blue bars, underlines)
- Lists use custom bullet points with blue styling
- Signature sections are properly formatted
- PDF generation includes professional styling

### Component Guidelines

- Use shadcn/ui components when possible
- Follow the existing design patterns
- Ensure responsive design for mobile devices
- Maintain accessibility standards

## 🐞 Reporting Issues

If you find a bug or have a feature request:

- Open an issue with a clear title and detailed description.
- Include steps to reproduce the bug if applicable.
- Attach screenshots or logs if helpful.
- Specify if the issue occurs in development (Ollama) or production (OpenAI).

## 🔧 Development Tools

### Available Scripts

```bash
# Development
npm run dev:setup    # Setup development environment
npm run dev          # Start development server
npm run dev:start    # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run prod:deploy  # Prepare for production deployment

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:run     # Run tests once

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Environment Configuration

- **Development**: Uses Ollama (no API keys needed)
- **Production**: Uses OpenAI (requires API key)
- **Environment Variables**: Automatically configured by setup scripts

## 🧪 Testing

### Testing with Real AI

- All contract generation uses real AI models
- Test both development (Ollama) and production (OpenAI) flows
- Verify contract styling and formatting
- Test PDF generation with enhanced styling

### Manual Testing Checklist

- [ ] Contract generation works with Ollama (development)
- [ ] Contract generation works with OpenAI (production)
- [ ] Contract styling displays correctly
- [ ] PDF export works with enhanced formatting
- [ ] Rich text editor functions properly
- [ ] Regeneration feature works correctly
- [ ] Mobile responsiveness is maintained

## 📁 Project Structure

Key files to be aware of:

```
contract-gpt/
├── app/api/
│   ├── generate-contract/      # Production OpenAI API
│   └── generate-contract-dev/  # Development Ollama API
├── components/
│   ├── contract/
│   │   ├── ContractEditor.tsx  # Rich text editor
│   │   └── ContractViewer.tsx  # Contract display
│   └── forms/
│       └── contract-form.tsx   # Contract generation form
├── utils/
│   ├── ai-config.ts           # AI provider configuration
│   └── pdf-utils.ts           # PDF generation
└── scripts/
    ├── dev-deploy.sh          # Development setup
    └── prod-deploy.sh         # Production deployment
```

## 🙏 Thank You

Your contributions make this project better! If you have any questions, feel free to open an issue or start a discussion.

### Getting Help

- Check existing issues and discussions
- Review the README.md for setup instructions
- Open an issue for bugs or feature requests
- Start a discussion for general questions
