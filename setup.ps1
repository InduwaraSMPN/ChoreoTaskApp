# Choreo Full-Stack Sample Setup Script
# This script sets up the development environment for the Task Management application

param(
    [switch]$SkipInstall,
    [switch]$SkipBuild,
    [switch]$StartServers,
    [switch]$Help
)

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param($Color, $Message)
    Write-Host "$Color$Message$Reset"
}

function Show-Help {
    Write-ColorOutput $Blue "Choreo Full-Stack Sample Setup Script"
    Write-Host ""
    Write-Host "USAGE:"
    Write-Host "  .\setup.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "OPTIONS:"
    Write-Host "  -SkipInstall    Skip npm install steps"
    Write-Host "  -SkipBuild      Skip build steps"
    Write-Host "  -StartServers   Start development servers after setup"
    Write-Host "  -Help           Show this help message"
    Write-Host ""
    Write-Host "EXAMPLES:"
    Write-Host "  .\setup.ps1                    # Full setup"
    Write-Host "  .\setup.ps1 -StartServers      # Setup and start servers"
    Write-Host "  .\setup.ps1 -SkipInstall       # Skip dependency installation"
    exit 0
}

function Test-NodeVersion {
    Write-ColorOutput $Blue "Checking Node.js version..."
    
    try {
        $nodeVersion = node --version
        $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        
        if ($majorVersion -ge 18) {
            Write-ColorOutput $Green "✓ Node.js $nodeVersion (compatible)"
            return $true
        } else {
            Write-ColorOutput $Red "✗ Node.js $nodeVersion (requires v18+)"
            return $false
        }
    } catch {
        Write-ColorOutput $Red "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
        return $false
    }
}

function Test-NpmVersion {
    Write-ColorOutput $Blue "Checking npm version..."
    
    try {
        $npmVersion = npm --version
        Write-ColorOutput $Green "✓ npm $npmVersion"
        return $true
    } catch {
        Write-ColorOutput $Red "✗ npm not found"
        return $false
    }
}

function Install-Dependencies {
    param($Directory, $Name)
    
    Write-ColorOutput $Blue "Installing $Name dependencies..."
    
    Push-Location $Directory
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput $Green "✓ $Name dependencies installed"
        } else {
            Write-ColorOutput $Red "✗ Failed to install $Name dependencies"
            return $false
        }
    } catch {
        Write-ColorOutput $Red "✗ Error installing $Name dependencies: $_"
        return $false
    } finally {
        Pop-Location
    }
    
    return $true
}

function Build-Project {
    param($Directory, $Name)
    
    Write-ColorOutput $Blue "Building $Name..."
    
    Push-Location $Directory
    try {
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput $Green "✓ $Name built successfully"
        } else {
            Write-ColorOutput $Yellow "⚠ $Name build completed with warnings"
        }
    } catch {
        Write-ColorOutput $Red "✗ Error building ${Name}: $_"
        return $false
    } finally {
        Pop-Location
    }
    
    return $true
}

function Start-DevServers {
    Write-ColorOutput $Blue "Starting development servers..."
    
    # Start backend server in background
    Write-ColorOutput $Yellow "Starting backend server on http://localhost:3001..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal
    
    Start-Sleep -Seconds 3
    
    # Start frontend server in background
    Write-ColorOutput $Yellow "Starting frontend server on http://localhost:3000..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal
    
    Start-Sleep -Seconds 2
    
    Write-ColorOutput $Green "✓ Development servers started!"
    Write-ColorOutput $Blue "Frontend: http://localhost:3000"
    Write-ColorOutput $Blue "Backend:  http://localhost:3001"
    Write-ColorOutput $Yellow "Press Ctrl+C in each terminal to stop the servers"
}

function Test-ProjectStructure {
    Write-ColorOutput $Blue "Checking project structure..."
    
    $requiredDirs = @("backend", "frontend", "docs")
    $requiredFiles = @(
        "backend/package.json",
        "backend/src/app.js",
        "backend/.choreo/component.yaml",
        "frontend/package.json",
        "frontend/src/app/page.tsx",
        "frontend/.choreo/component.yaml"
    )
    
    foreach ($dir in $requiredDirs) {
        if (Test-Path $dir) {
            Write-ColorOutput $Green "✓ Directory: $dir"
        } else {
            Write-ColorOutput $Red "✗ Missing directory: $dir"
            return $false
        }
    }
    
    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-ColorOutput $Green "✓ File: $file"
        } else {
            Write-ColorOutput $Red "✗ Missing file: $file"
            return $false
        }
    }
    
    return $true
}

function Show-NextSteps {
    Write-ColorOutput $Green "`n🎉 Setup completed successfully!"
    Write-Host ""
    Write-ColorOutput $Blue "NEXT STEPS:"
    Write-Host ""
    Write-Host "1. Local Development:"
    Write-Host "   cd backend && npm run dev     # Start backend server"
    Write-Host "   cd frontend && npm run dev    # Start frontend server"
    Write-Host ""
    Write-Host "2. Access the application:"
    Write-Host "   Frontend: http://localhost:3000"
    Write-Host "   Backend:  http://localhost:3001"
    Write-Host ""
    Write-Host "3. Deploy to Choreo:"
    Write-Host "   See docs/deployment-guide.md for detailed instructions"
    Write-Host ""
    Write-Host "4. Documentation:"
    Write-Host "   README.md                     # Project overview"
    Write-Host "   docs/deployment-guide.md      # Deployment instructions"
    Write-Host "   docs/authentication-flow.md   # Authentication details"
    Write-Host "   docs/api-documentation.md     # API reference"
    Write-Host ""
    Write-ColorOutput $Yellow "Happy coding! 🚀"
}

# Main execution
if ($Help) {
    Show-Help
}

Write-ColorOutput $Blue "🚀 Choreo Full-Stack Sample Setup"
Write-Host "=================================="
Write-Host ""

# Check prerequisites
Write-ColorOutput $Blue "Checking prerequisites..."
if (-not (Test-NodeVersion)) { exit 1 }
if (-not (Test-NpmVersion)) { exit 1 }

# Check project structure
if (-not (Test-ProjectStructure)) {
    Write-ColorOutput $Red "Project structure validation failed. Please ensure you're in the correct directory."
    exit 1
}

# Install dependencies
if (-not $SkipInstall) {
    Write-Host ""
    Write-ColorOutput $Blue "Installing dependencies..."
    
    if (-not (Install-Dependencies "backend" "Backend")) { exit 1 }
    if (-not (Install-Dependencies "frontend" "Frontend")) { exit 1 }
} else {
    Write-ColorOutput $Yellow "Skipping dependency installation"
}

# Build projects
if (-not $SkipBuild) {
    Write-Host ""
    Write-ColorOutput $Blue "Building projects..."
    
    Build-Project "backend" "Backend"
    Build-Project "frontend" "Frontend"
} else {
    Write-ColorOutput $Yellow "Skipping build steps"
}

# Start servers if requested
if ($StartServers) {
    Write-Host ""
    Start-DevServers
} else {
    Show-NextSteps
}
