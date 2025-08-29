#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}[INFO]${NC} 🚀 Preparing ContractGPT for Production Deployment..."
echo -e "${BLUE}[INFO]${NC} This will configure the app for production with OpenAI"
echo ""

# Function to install dependencies
install_dependencies() {
    echo -e "${BLUE}[INFO]${NC} Installing production dependencies..."
    
    if npm ci --only=production; then
        echo -e "${GREEN}[SUCCESS]${NC} Production dependencies installed"
    else
        echo -e "${RED}[ERROR]${NC} Failed to install production dependencies"
        return 1
    fi
}

# Function to run tests
run_tests() {
    echo -e "${BLUE}[INFO]${NC} Running tests..."
    
    if npm test; then
        echo -e "${GREEN}[SUCCESS]${NC} All tests passed"
    else
        echo -e "${RED}[ERROR]${NC} Tests failed"
        return 1
    fi
}

# Function to run linting
run_linting() {
    echo -e "${BLUE}[INFO]${NC} Running linting..."
    
    if npm run lint; then
        echo -e "${GREEN}[SUCCESS]${NC} Linting passed"
    else
        echo -e "${RED}[ERROR]${NC} Linting failed"
        return 1
    fi
}

# Function to build the application
build_app() {
    echo -e "${BLUE}[INFO]${NC} Building the application..."
    
    if npm run build; then
        echo -e "${GREEN}[SUCCESS]${NC} Application built successfully"
    else
        echo -e "${RED}[ERROR]${NC} Build failed"
        return 1
    fi
}

# Function to setup database
setup_database() {
    echo -e "${BLUE}[INFO]${NC} Setting up database..."
    
    if [ -f "scripts/setup-database.sql" ]; then
        echo -e "${YELLOW}[WARNING]${NC} Please run scripts/setup-database.sql in your Supabase SQL editor"
    else
        echo -e "${BLUE}[INFO]${NC} No database setup script found"
    fi
}

# Function to check environment variables
check_environment() {
    echo -e "${BLUE}[INFO]${NC} Checking environment configuration..."
    
    # Check for required environment variables
    local missing_vars=()
    
    if [ -z "$OPENAI_API_KEY" ]; then
        missing_vars+=("OPENAI_API_KEY")
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        missing_vars+=("NEXT_PUBLIC_SUPABASE_URL")
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
        missing_vars+=("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    fi
    
    if [ ${#missing_vars[@]} -eq 0 ]; then
        echo -e "${GREEN}[SUCCESS]${NC} All required environment variables are set"
    else
        echo -e "${RED}[ERROR]${NC} Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo -e "${RED}[ERROR]${NC}   - $var"
        done
        echo -e "${YELLOW}[WARNING]${NC} Please set these environment variables in your deployment platform"
        return 1
    fi
}

# Function to show deployment instructions
show_deployment_instructions() {
    echo -e "${GREEN}[SUCCESS]${NC} 🎉 Production preparation complete!"
    echo ""
    echo -e "${BLUE}[INFO]${NC} 📋 Deployment Instructions:"
    echo ""
    echo -e "${BLUE}[INFO]${NC} 🚀 Vercel Deployment:"
    echo -e "${BLUE}[INFO]${NC}   1. Push your code to GitHub"
    echo -e "${BLUE}[INFO]${NC}   2. Connect your repository to Vercel"
    echo -e "${BLUE}[INFO]${NC}   3. Set environment variables in Vercel dashboard:"
    echo -e "${BLUE}[INFO]${NC}      - OPENAI_API_KEY"
    echo -e "${BLUE}[INFO]${NC}      - NEXT_PUBLIC_SUPABASE_URL"
    echo -e "${BLUE}[INFO]${NC}      - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo -e "${BLUE}[INFO]${NC}   4. Deploy!"
    echo ""
    echo -e "${BLUE}[INFO]${NC} 🚀 Netlify Deployment:"
    echo -e "${BLUE}[INFO]${NC}   1. Push your code to GitHub"
    echo -e "${BLUE}[INFO]${NC}   2. Connect your repository to Netlify"
    echo -e "${BLUE}[INFO]${NC}   3. Set environment variables in Netlify dashboard"
    echo -e "${BLUE}[INFO]${NC}   4. Deploy!"
    echo ""
    echo -e "${BLUE}[INFO]${NC} 🚀 Docker Deployment:"
    echo -e "${BLUE}[INFO]${NC}   1. Build the Docker image: docker build -t contract-gpt ."
    echo -e "${BLUE}[INFO]${NC}   2. Run with environment variables:"
    echo -e "${BLUE}[INFO]${NC}      docker run -p 3000:3000 -e OPENAI_API_KEY=your_key contract-gpt"
    echo ""
    echo -e "${BLUE}[INFO]${NC} 📋 Configuration Summary:"
    echo -e "${BLUE}[INFO]${NC}   🟢 Development: Ollama (free, local)"
    echo -e "${BLUE}[INFO]${NC}   🔴 Production: OpenAI (cloud)"
    echo ""
    echo -e "${YELLOW}[WARNING]${NC} Make sure to set NODE_ENV=production in your deployment environment"
}

# Main execution
main() {
    # Check environment variables
    if ! check_environment; then
        echo -e "${YELLOW}[WARNING]${NC} Continuing without all environment variables..."
    fi
    
    # Install dependencies
    if ! install_dependencies; then
        echo -e "${RED}[ERROR]${NC} Failed to install dependencies"
        exit 1
    fi
    
    # Run tests (if available)
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        if ! run_tests; then
            echo -e "${RED}[ERROR]${NC} Tests failed"
            exit 1
        fi
    else
        echo -e "${BLUE}[INFO]${NC} No tests configured, skipping..."
    fi
    
    # Run linting (if available)
    if [ -f "package.json" ] && grep -q '"lint"' package.json; then
        if ! run_linting; then
            echo -e "${RED}[ERROR]${NC} Linting failed"
            exit 1
        fi
    else
        echo -e "${BLUE}[INFO]${NC} No linting configured, skipping..."
    fi
    
    # Build the application
    if ! build_app; then
        echo -e "${RED}[ERROR]${NC} Build failed"
        exit 1
    fi
    
    # Setup database
    setup_database
    
    # Show deployment instructions
    show_deployment_instructions
}

# Run main function
main "$@"
