#!/bin/bash

# ContractGPT Development Setup Script
# Installs and configures everything needed for development

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to detect OS
detect_os() {
    case "$(uname -s)" in
        Linux*)     echo "linux";;
        Darwin*)    echo "macos";;
        CYGWIN*)    echo "windows";;
        MINGW*)     echo "windows";;
        *)          echo "unknown";;
    esac
}

# Function to install Ollama
install_ollama() {
    print_status "Installing Ollama..."
    
    if command_exists ollama; then
        print_success "Ollama is already installed"
        return 0
    fi
    
    OS=$(detect_os)
    
    case $OS in
        "macos")
            print_status "Installing Ollama on macOS..."
            curl -fsSL https://ollama.ai/install.sh | sh
            ;;
        "linux")
            print_status "Installing Ollama on Linux..."
            curl -fsSL https://ollama.ai/install.sh | sh
            ;;
        "windows")
            print_warning "Windows installation not supported in this script"
            print_status "Please install Ollama manually from https://ollama.ai"
            return 1
            ;;
        *)
            print_error "Unsupported operating system: $OS"
            return 1
            ;;
    esac
    
    print_success "Ollama installed successfully"
}

# Function to setup Ollama
setup_ollama() {
    print_status "Setting up Ollama..."
    
    # Start Ollama service
    print_status "Starting Ollama service..."
    ollama serve &
    OLLAMA_PID=$!
    
    # Wait for Ollama to start
    print_status "Waiting for Ollama to start..."
    for i in {1..30}; do
        if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
            print_success "Ollama is running"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Failed to start Ollama after 30 seconds"
            return 1
        fi
        sleep 1
    done
    
    # Pull recommended model
    print_status "Pulling llama3.2:3b model (this may take a few minutes)..."
    ollama pull llama3.2:3b
    
    print_success "Ollama setup complete"
}

# Function to setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local file..."
        cat > .env.local << EOF
# Development Configuration (Ollama - Free)
# The app will automatically use Ollama in development
# No AI_PROVIDER needed - defaults to 'ollama' in dev

# Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# Production Configuration (OpenAI - Paid)
# Uncomment these for production deployment
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key
# OPENAI_MODEL=gpt-4

# Alternative Production Options
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=your_anthropic_api_key
# ANTHROPIC_MODEL=claude-3-sonnet-20240229
EOF
        print_success "Created .env.local with development configuration"
    else
        print_warning ".env.local already exists"
        print_status "The app will automatically use:"
        print_status "  - Ollama in development (free)"
        print_status "  - OpenAI in production (paid)"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing Node.js dependencies..."
    
    if [ ! -f package.json ]; then
        print_error "package.json not found. Are you in the correct directory?"
        return 1
    fi
    
    npm install
    
    print_success "Dependencies installed"
}

# Function to setup database (if needed)
setup_database() {
    print_status "Setting up database..."
    
    if [ -f "scripts/setup-database.sql" ]; then
        print_status "Database setup script found"
        print_warning "Please run scripts/setup-database.sql in your Supabase SQL editor"
    else
        print_status "No database setup script found"
    fi
}

# Function to start development server
start_dev_server() {
    print_status "Starting development server..."
    
    print_success "Starting development server on http://localhost:3000"
    print_status "Press Ctrl+C to stop the server"
    
    npm run dev
}

# Main development setup
main() {
    print_status "🚀 Setting up ContractGPT Development Environment..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    # Install and setup everything
    install_ollama
    setup_ollama
    setup_env
    install_dependencies
    setup_database
    
    print_success "🎉 Development setup complete!"
    print_status ""
    print_status "📋 Configuration Summary:"
    print_status "  🟢 Development: Ollama (free, local)"
    print_status "  🔴 Production: OpenAI (paid, cloud)"
    print_status ""
    print_status "🚀 Starting development server..."
    
    # Start the development server
    start_dev_server
}

# Run main function
main "$@"
