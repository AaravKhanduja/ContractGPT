# ContractGPT

AI-powered contract generation tool that transforms client requests into professional contracts. Built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

## ✨ Features

- **AI Contract Generation**: Transform client requests into professional contracts using OpenAI GPT-4 (production) or Ollama (development)
- **Rich Text Editor**: Notion-style editing with TipTap for contract customization
- **PDF Export**: Download contracts as professionally formatted PDFs with enhanced styling
- **Authentication**: Secure user authentication with Supabase Auth
- **Data Persistence**: Supabase database with Row Level Security (RLS)
- **Modern UI**: Beautiful, responsive interface with enhanced contract styling
- **Environment-Specific AI**: Ollama for free development, OpenAI for production
- **Real AI Generation**: No mock contracts - always uses real AI models

## 🚀 Quick Start

### One Command Setup (Recommended)

```bash
# Clone and setup everything in one command
git clone https://github.com/AaravKhanduja/ContractGPT.git
cd contract-gpt
npm run dev:setup
```

This will automatically:

- Install Ollama (free AI model for development)
- Pull the llama3.2:3b model
- Install all dependencies
- Create environment configuration
- Start the development server

### Manual Setup (Alternative)

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/contract-gpt.git
   cd contract-gpt
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   For development (Ollama):

   ```bash
   cp .env.example .env.local
   # No API keys needed for development - uses Ollama
   ```

   For production (OpenAI):

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### AI Configuration

- **Development**: Uses Ollama with llama3.2:3b model (free, local)
- **Production**: Uses OpenAI GPT-4 API (cloud-based)
- **No Mock Contracts**: All contract generation uses real AI models

### Development Mode (Default)

- **AI Provider**: Ollama (local, free)
- **Authentication**: Simulated with localStorage (no setup required)
- **Data Storage**: localStorage for contracts and user data
- **No Database Required**: Works out of the box for contributors
- **Perfect for**: Quick development, testing, and contributions

### Production Mode (With Supabase)

- **AI Provider**: OpenAI GPT-4
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Data Storage**: Persistent database with user isolation
- **Deployment**: Vercel, Netlify, or custom server
- **Perfect for**: Production applications with real users

### OAuth Setup

The app supports Google OAuth through Supabase. To enable:

1. **Google Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Set redirect URI to: `https://xtrqrnwheomcoamjoopz.supabase.co/auth/v1/callback`

2. **Supabase Setup**:
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Enter your Google OAuth Client ID and Client Secret
   - Save configuration

3. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:setup    # Setup development environment (Ollama + dependencies)
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

# Database & Security
npm run rls:check    # Check Row Level Security status
```

## 🧱 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **Rich Text Editor**: TipTap with custom extensions and enhanced styling
- **Authentication**: Supabase Auth with SSR support
- **Database**: Supabase PostgreSQL with RLS
- **AI Integration**:
  - Development: Ollama (llama3.2:3b) - free, local
  - Production: OpenAI GPT-4 API
- **PDF Generation**: jsPDF with professional formatting and styling
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel-ready with production optimizations

## 📁 Project Structure

```
contract-gpt/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── generate-contract/      # Production OpenAI API
│   │   └── generate-contract-dev/  # Development Ollama API
│   ├── auth/              # Authentication pages
│   ├── contracts/         # Contract management
│   └── contract/[id]/     # Individual contract view with regeneration
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── contract/         # Contract editor & viewer components
│   ├── forms/            # Form components
│   ├── saved-contracts/  # Contract list components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
├── scripts/              # Deployment and setup scripts
│   ├── dev-deploy.sh     # Development environment setup
│   ├── prod-deploy.sh    # Production deployment preparation
│   └── setup-database.sql # Database setup
├── utils/                # Utilities
│   ├── ai-config.ts      # AI provider configuration
│   └── pdf-utils.ts      # Enhanced PDF generation
└── test/                 # Test setup and utilities
```

## 🔧 Configuration

### Environment Variables

| Variable                        | Description                            | Required | Development | Production |
| ------------------------------- | -------------------------------------- | -------- | ----------- | ---------- |
| `OPENAI_API_KEY`                | OpenAI API key for contract generation | ❌       | ❌          | ✅         |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                   | ❌       | ❌          | ✅         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                 | ❌       | ❌          | ✅         |

**Development Mode**: No API keys required. Uses Ollama (free, local AI model) and localStorage for auth.

**Production Mode**: Requires OpenAI API key and Supabase credentials for full functionality.

**Optional Supabase Integration**: If you want to use Supabase for authentication, add these variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### AI Provider Configuration

The app automatically selects the appropriate AI provider based on the environment:

- **Development (`NODE_ENV=development`)**: Uses Ollama with llama3.2:3b
- **Production (`NODE_ENV=production`)**: Uses OpenAI GPT-4

### Security Features

#### Development Mode

- **Local AI**: Ollama runs locally, no external API calls
- **Local Storage**: Simulated authentication for easy development
- **No Database**: All data stored locally in browser
- **Zero Setup**: Perfect for contributors and testing

#### Production Mode

- **Cloud AI**: OpenAI GPT-4 for high-quality contract generation
- **Existing Auth System**: Uses your current authentication setup
- **No Client-Side Secrets**: No sensitive data exposed to browser
- **Simple Integration**: Works with your existing auth pages

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. **Setup Development Environment**:

   ```bash
   npm run dev:setup
   ```

2. **Start Development Server**:

   ```bash
   npm run dev
   ```

3. **Make Changes**: The app uses Ollama for free AI generation during development

4. **Test**: All changes are tested with real AI generation (no mocks)

## 🚀 Deployment

### Quick Deploy

#### Vercel (Recommended)

```bash
# 1. Connect your GitHub repository to Vercel
# 2. Set environment variables in Vercel dashboard
# 3. Deploy automatically on push to main

# Environment variables needed for production:
NODE_ENV=production
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Netlify

```bash
# 1. Connect GitHub repository to Netlify
# 2. Build command: npm run build
# 3. Publish directory: .next
# 4. Set environment variables in Netlify dashboard
```

### Production Setup

#### 1. Prepare for Production

```bash
# Run production deployment script
npm run prod:deploy
```

This script will:

- Install production dependencies
- Run tests and linting
- Build the application
- Verify environment variables

#### 2. Supabase Database (Optional)

```sql
-- Run in Supabase SQL Editor
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (see scripts/setup-database.sql)
```

#### 3. Environment Variables

```bash
# Required for production
NODE_ENV=production
OPENAI_API_KEY=sk-prod-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=...

# Optional for enhanced security
NEXTAUTH_SECRET=your-256-bit-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Monitoring & Performance

#### Health Checks

```bash
# Check deployment readiness
npm run prod:deploy

# Verify RLS configuration
npm run rls:check

# Run security audit
npm audit
```

#### Performance Optimization

- **CDN**: Automatic with Vercel/Netlify
- **Caching**: Static assets and API responses
- **Database Indexes**: Optimized queries
- **Bundle Optimization**: Tree shaking and code splitting

## 📚 Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [LICENSE](LICENSE) - MIT License

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
