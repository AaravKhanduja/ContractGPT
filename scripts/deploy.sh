#!/bin/bash

# Production Deployment Script for ContractGPT
set -e

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Check environment variables
echo "📋 Checking environment variables..."
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY is not set"
    exit 1
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "⚠️  Warning: Supabase environment variables not set. Will use localStorage fallback."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run tests
echo "🧪 Running tests..."
npm run test:run

# Build the application
echo "🔨 Building application..."
npm run build

# Run linting
echo "🔍 Running linting..."
npm run lint

echo "✅ Production build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your production domain"
echo "2. Configure environment variables on your hosting platform"
echo "3. Deploy to your preferred hosting service (Vercel, Netlify, etc.)"
echo ""
echo "🌐 For Vercel deployment:"
echo "   - Connect your GitHub repository"
echo "   - Add environment variables in Vercel dashboard"
echo "   - Deploy automatically on push to main branch" 