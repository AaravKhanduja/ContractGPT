# ContractGPT

AI-powered contract generation tool that transforms client requests into professional contracts. Built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

## ✨ Features

- **AI Contract Generation**: Transform client requests into professional contracts using OpenAI GPT-4
- **Rich Text Editor**: Notion-style editing with TipTap for contract customization
- **PDF Export**: Download contracts as professionally formatted PDFs
- **Authentication**: Secure user authentication with Supabase Auth
- **Data Persistence**: Supabase database with Row Level Security (RLS)
- **Modern UI**: Beautiful, responsive interface with glass morphism effects
- **Development Mode**: localStorage fallback for development without database setup

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (required for Next.js development and build)
- **npm or yarn** (package manager)
- **OpenAI API key** (for contract generation)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AaravKhanduja/ContractGPT.git
   cd ContractGPT
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your OpenAI API key:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Development Mode

- **Authentication**: Simulated with localStorage
- **Data Storage**: localStorage for contracts
- **No Database Required**: Works out of the box

### Production Mode

- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL with RLS
- **Deployment**: Vercel, Netlify, or custom server

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:run     # Run tests once

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Deployment
npm run deploy:check # Check deployment readiness
```

## 🧱 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **Rich Text Editor**: TipTap with custom extensions
- **Authentication**: Supabase Auth with SSR support
- **Database**: Supabase PostgreSQL with RLS
- **AI Integration**: OpenAI GPT-4 API
- **PDF Generation**: jsPDF with custom formatting
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel-ready with production optimizations

## 📁 Project Structure

```
contract-gpt/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── contracts/         # Contract management
│   └── contract/[id]/     # Individual contract view
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── contract/         # Contract editor components
│   ├── forms/            # Form components
│   ├── saved-contracts/  # Contract list components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── database.ts       # Database service layer
│   ├── supabase.ts       # Supabase client
│   └── pdf-utils.ts      # PDF generation utilities
├── scripts/              # Database and deployment scripts
└── test/                 # Test setup and utilities
```

## 🔧 Configuration

### Environment Variables

| Variable            | Description                            | Required      |
| ------------------- | -------------------------------------- | ------------- |
| `OPENAI_API_KEY`    | OpenAI API key for contract generation | ✅            |
| `SUPABASE_URL`      | Supabase project URL                   | ❌ (dev mode) |
| `SUPABASE_ANON_KEY` | Supabase anonymous key                 | ❌ (dev mode) |

### Development vs Production

The app automatically detects your environment:

- **Development**: Uses localStorage for data persistence
- **Production**: Uses Supabase database with authentication

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🚀 Deployment

### Quick Deploy

#### Vercel (Recommended)

```bash
# 1. Connect your GitHub repository to Vercel
# 2. Set environment variables in Vercel dashboard
# 3. Deploy automatically on push to main

# Environment variables needed:
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

#### 1. Supabase Database

```sql
-- Run in Supabase SQL Editor
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (see scripts/setup-database.sql)
```

#### 2. Environment Variables

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

#### 3. Security Configuration

- **Row Level Security (RLS)**: Enabled on all database tables
- **Security Headers**: Configured in next.config.ts
- **Rate Limiting**: Implemented on API routes
- **Input Validation**: All user inputs sanitized

### Monitoring & Performance

#### Health Checks

```bash
# Check deployment readiness
npm run deploy:check

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

### Disaster Recovery

#### Backup Strategy

- **Database**: Automated Supabase backups
- **Code**: GitHub repository with version control
- **Environment**: Secure variable storage

#### Recovery Procedures

```bash
# Rollback deployment
vercel rollback

# Restore from backup
# Use Supabase point-in-time recovery
```

## 📚 Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [LICENSE](LICENSE) - MIT License

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
