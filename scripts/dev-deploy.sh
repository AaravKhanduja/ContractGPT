#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}[INFO]${NC} 🚀 Setting up ContractGPT Development Environment..."
echo -e "${BLUE}[INFO]${NC} This will install Ollama and configure the app for local development"
echo ""

# Function to install Ollama
install_ollama() {
    echo -e "${BLUE}[INFO]${NC} Installing Ollama..."
    
    if command -v ollama &> /dev/null; then
        echo -e "${GREEN}[SUCCESS]${NC} Ollama is already installed"
        return 0
    fi
    
    # Install Ollama based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo -e "${BLUE}[INFO]${NC} Installing Ollama for macOS..."
        curl -fsSL https://ollama.ai/install.sh | sh
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo -e "${BLUE}[INFO]${NC} Installing Ollama for Linux..."
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        echo -e "${RED}[ERROR]${NC} Unsupported operating system: $OSTYPE"
        echo -e "${YELLOW}[WARNING]${NC} Please install Ollama manually from https://ollama.ai"
        return 1
    fi
    
    if command -v ollama &> /dev/null; then
        echo -e "${GREEN}[SUCCESS]${NC} Ollama installed successfully"
        return 0
    else
        echo -e "${RED}[ERROR]${NC} Failed to install Ollama"
        return 1
    fi
}

# Function to setup Ollama
setup_ollama() {
    echo -e "${BLUE}[INFO]${NC} Setting up Ollama..."
    
    # Start Ollama service
    echo -e "${BLUE}[INFO]${NC} Starting Ollama service..."
    ollama serve &
    OLLAMA_PID=$!
    
    # Wait for Ollama to start
    echo -e "${BLUE}[INFO]${NC} Waiting for Ollama to start..."
    for i in {1..30}; do
        if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
            echo -e "${GREEN}[SUCCESS]${NC} Ollama is running"
            break
        fi
        if [ $i -eq 30 ]; then
            echo -e "${RED}[ERROR]${NC} Ollama failed to start within 30 seconds"
            return 1
        fi
        sleep 1
    done
    
    # Pull the model
    echo -e "${BLUE}[INFO]${NC} Pulling llama3.2:3b model (this may take a few minutes)..."
    if ollama pull llama3.2:3b; then
        echo -e "${GREEN}[SUCCESS]${NC} Model pulled successfully"
    else
        echo -e "${RED}[ERROR]${NC} Failed to pull model"
        return 1
    fi
    
    echo -e "${GREEN}[SUCCESS]${NC} Ollama setup complete"
}

# Function to setup environment variables
setup_env() {
    echo -e "${BLUE}[INFO]${NC} Setting up environment variables..."
    
    if [ -f .env.local ]; then
        echo -e "${YELLOW}[WARNING]${NC} .env.local already exists"
        echo -e "${BLUE}[INFO]${NC} The app will automatically use:"
        echo -e "${BLUE}[INFO]${NC}   - Ollama in development (free)"
        echo -e "${BLUE}[INFO]${NC}   - OpenAI in production (paid)"
    else
        echo -e "${BLUE}[INFO]${NC} Creating .env.local file..."
        cat > .env.local << EOF
# Development Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Ollama Configuration (Development Only)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# OpenAI Configuration (Production Only)
# OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_MODEL=gpt-4

# Supabase Configuration
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
        echo -e "${GREEN}[SUCCESS]${NC} .env.local created"
    fi
}

# Function to install dependencies
install_dependencies() {
    echo -e "${BLUE}[INFO]${NC} Installing Node.js dependencies..."
    
    if npm install; then
        echo -e "${GREEN}[SUCCESS]${NC} Dependencies installed"
    else
        echo -e "${RED}[ERROR]${NC} Failed to install dependencies"
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

# Function to start development server
start_dev_server() {
    echo -e "${BLUE}[INFO]${NC} Starting development server..."
    echo -e "${BLUE}[INFO]${NC} Starting development server..."
    echo -e "${GREEN}[SUCCESS]${NC} Starting development server on http://localhost:3000"
    echo -e "${BLUE}[INFO]${NC} Press Ctrl+C to stop the server"
    echo ""
    
    npm run dev
}

# Main execution
main() {
    # Install Ollama
    if ! install_ollama; then
        echo -e "${RED}[ERROR]${NC} Failed to install Ollama"
        exit 1
    fi
    
    # Setup Ollama
    if ! setup_ollama; then
        echo -e "${RED}[ERROR]${NC} Failed to setup Ollama"
        exit 1
    fi
    
    # Setup environment
    setup_env
    
    # Install dependencies
    if ! install_dependencies; then
        echo -e "${RED}[ERROR]${NC} Failed to install dependencies"
        exit 1
    fi
    
    # Setup database
    setup_database
    
    echo -e "${GREEN}[SUCCESS]${NC} 🎉 Development setup complete!"
    echo ""
    echo -e "${BLUE}[INFO]${NC} 📋 Configuration Summary:"
    echo -e "${BLUE}[INFO]${NC}   🟢 Development: Ollama (free, local)"
    echo -e "${BLUE}[INFO]${NC}   🔴 Production: OpenAI (paid, cloud)"
    echo ""
    
    # Start development server
    start_dev_server
}

# Run main function
main "$@"
