#!/bin/bash

# Choreo Full-Stack Sample Setup Script
# This script sets up the development environment for the Task Management application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
SKIP_INSTALL=false
SKIP_BUILD=false
START_SERVERS=false
SHOW_HELP=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-install)
            SKIP_INSTALL=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --start-servers)
            START_SERVERS=true
            shift
            ;;
        --help|-h)
            SHOW_HELP=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

function print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

function show_help() {
    print_color $BLUE "Choreo Full-Stack Sample Setup Script"
    echo ""
    echo "USAGE:"
    echo "  ./setup.sh [OPTIONS]"
    echo ""
    echo "OPTIONS:"
    echo "  --skip-install    Skip npm install steps"
    echo "  --skip-build      Skip build steps"
    echo "  --start-servers   Start development servers after setup"
    echo "  --help, -h        Show this help message"
    echo ""
    echo "EXAMPLES:"
    echo "  ./setup.sh                    # Full setup"
    echo "  ./setup.sh --start-servers    # Setup and start servers"
    echo "  ./setup.sh --skip-install     # Skip dependency installation"
    exit 0
}

function check_node_version() {
    print_color $BLUE "Checking Node.js version..."
    
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        local major_version=$(echo $node_version | sed 's/v\([0-9]*\).*/\1/')
        
        if [ "$major_version" -ge 18 ]; then
            print_color $GREEN "✓ Node.js $node_version (compatible)"
            return 0
        else
            print_color $RED "✗ Node.js $node_version (requires v18+)"
            return 1
        fi
    else
        print_color $RED "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
        return 1
    fi
}

function check_npm_version() {
    print_color $BLUE "Checking npm version..."
    
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        print_color $GREEN "✓ npm $npm_version"
        return 0
    else
        print_color $RED "✗ npm not found"
        return 1
    fi
}

function install_dependencies() {
    local directory=$1
    local name=$2
    
    print_color $BLUE "Installing $name dependencies..."
    
    cd $directory
    if npm install; then
        print_color $GREEN "✓ $name dependencies installed"
        cd ..
        return 0
    else
        print_color $RED "✗ Failed to install $name dependencies"
        cd ..
        return 1
    fi
}

function build_project() {
    local directory=$1
    local name=$2
    
    print_color $BLUE "Building $name..."
    
    cd $directory
    if npm run build; then
        print_color $GREEN "✓ $name built successfully"
        cd ..
        return 0
    else
        print_color $YELLOW "⚠ $name build completed with warnings"
        cd ..
        return 0
    fi
}

function start_dev_servers() {
    print_color $BLUE "Starting development servers..."
    
    # Check if tmux is available
    if command -v tmux &> /dev/null; then
        print_color $YELLOW "Starting servers in tmux session 'choreo-dev'..."
        
        # Create new tmux session
        tmux new-session -d -s choreo-dev
        
        # Split window and start backend
        tmux send-keys -t choreo-dev "cd backend && npm run dev" C-m
        tmux split-window -h -t choreo-dev
        
        # Start frontend in second pane
        tmux send-keys -t choreo-dev "cd frontend && npm run dev" C-m
        
        print_color $GREEN "✓ Development servers started in tmux session!"
        print_color $BLUE "Frontend: http://localhost:3000"
        print_color $BLUE "Backend:  http://localhost:3001"
        print_color $YELLOW "Run 'tmux attach -t choreo-dev' to view the servers"
        print_color $YELLOW "Run 'tmux kill-session -t choreo-dev' to stop the servers"
    else
        print_color $YELLOW "tmux not found. Starting servers in background..."
        
        # Start backend in background
        cd backend
        npm run dev &
        BACKEND_PID=$!
        cd ..
        
        # Wait a moment
        sleep 3
        
        # Start frontend in background
        cd frontend
        npm run dev &
        FRONTEND_PID=$!
        cd ..
        
        print_color $GREEN "✓ Development servers started!"
        print_color $BLUE "Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
        print_color $BLUE "Backend:  http://localhost:3001 (PID: $BACKEND_PID)"
        print_color $YELLOW "Use 'kill $BACKEND_PID $FRONTEND_PID' to stop the servers"
    fi
}

function check_project_structure() {
    print_color $BLUE "Checking project structure..."
    
    local required_dirs=("backend" "frontend" "docs")
    local required_files=(
        "backend/package.json"
        "backend/src/app.js"
        "backend/.choreo/component.yaml"
        "frontend/package.json"
        "frontend/src/app/page.tsx"
        "frontend/.choreo/component.yaml"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [ -d "$dir" ]; then
            print_color $GREEN "✓ Directory: $dir"
        else
            print_color $RED "✗ Missing directory: $dir"
            return 1
        fi
    done
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            print_color $GREEN "✓ File: $file"
        else
            print_color $RED "✗ Missing file: $file"
            return 1
        fi
    done
    
    return 0
}

function show_next_steps() {
    print_color $GREEN "\n🎉 Setup completed successfully!"
    echo ""
    print_color $BLUE "NEXT STEPS:"
    echo ""
    echo "1. Local Development:"
    echo "   cd backend && npm run dev     # Start backend server"
    echo "   cd frontend && npm run dev    # Start frontend server"
    echo ""
    echo "2. Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo ""
    echo "3. Deploy to Choreo:"
    echo "   See docs/deployment-guide.md for detailed instructions"
    echo ""
    echo "4. Documentation:"
    echo "   README.md                     # Project overview"
    echo "   docs/deployment-guide.md      # Deployment instructions"
    echo "   docs/authentication-flow.md   # Authentication details"
    echo "   docs/api-documentation.md     # API reference"
    echo ""
    print_color $YELLOW "Happy coding! 🚀"
}

# Main execution
if [ "$SHOW_HELP" = true ]; then
    show_help
fi

print_color $BLUE "🚀 Choreo Full-Stack Sample Setup"
echo "=================================="
echo ""

# Check prerequisites
print_color $BLUE "Checking prerequisites..."
check_node_version || exit 1
check_npm_version || exit 1

# Check project structure
if ! check_project_structure; then
    print_color $RED "Project structure validation failed. Please ensure you're in the correct directory."
    exit 1
fi

# Install dependencies
if [ "$SKIP_INSTALL" = false ]; then
    echo ""
    print_color $BLUE "Installing dependencies..."
    
    install_dependencies "backend" "Backend" || exit 1
    install_dependencies "frontend" "Frontend" || exit 1
else
    print_color $YELLOW "Skipping dependency installation"
fi

# Build projects
if [ "$SKIP_BUILD" = false ]; then
    echo ""
    print_color $BLUE "Building projects..."
    
    build_project "backend" "Backend"
    build_project "frontend" "Frontend"
else
    print_color $YELLOW "Skipping build steps"
fi

# Start servers if requested
if [ "$START_SERVERS" = true ]; then
    echo ""
    start_dev_servers
else
    show_next_steps
fi
