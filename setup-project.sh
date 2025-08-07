#!/bin/bash

# AI Workspace Project Setup Script
# This script sets up the complete development environment with auto-commit functionality

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
MAIN_REPO="https://github.com/AsithaLKonara/All-in-One-AI-WorkSpace.git"
BACKUP_REPO="https://github.com/AsithaLKonara/systempromptsandmodelsofaitools.git"
PROJECT_NAME="All-in-One-AI-WorkSpace"

# Function to log messages
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to show banner
show_banner() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    AI WORKSPACE SETUP                        ║"
    echo "║                                                              ║"
    echo "║  🚀 Setting up your All-in-One AI Workspace Project        ║"
    echo "║  🔄 Auto-commit system with dual repository sync           ║"
    echo "║  💰 Ready for SaaS monetization                            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    log "${YELLOW}Checking prerequisites...${NC}"
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        echo -e "${RED}Error: Git is not installed${NC}"
        exit 1
    fi
    
    # Check if node is installed
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed${NC}"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm is not installed${NC}"
        exit 1
    fi
    
    log "${GREEN}✓ All prerequisites are satisfied${NC}"
}

# Function to initialize git repository
setup_git() {
    log "${YELLOW}Setting up Git repository...${NC}"
    
    # Initialize git if not already done
    if [ ! -d ".git" ]; then
        git init
        log "${GREEN}✓ Git repository initialized${NC}"
    else
        log "${GREEN}✓ Git repository already exists${NC}"
    fi
    
    # Set main as default branch
    git branch -M main
    
    # Add remotes
    if ! git remote get-url origin &> /dev/null; then
        git remote add origin "$MAIN_REPO"
        log "${GREEN}✓ Added origin remote${NC}"
    else
        log "${GREEN}✓ Origin remote already configured${NC}"
    fi
    
    if ! git remote get-url backup &> /dev/null; then
        git remote add backup "$BACKUP_REPO"
        log "${GREEN}✓ Added backup remote${NC}"
    else
        log "${GREEN}✓ Backup remote already configured${NC}"
    fi
    
    # Configure git user if not set
    if [ -z "$(git config user.name)" ]; then
        git config user.name "AI Workspace Bot"
        git config user.email "ai-workspace@example.com"
        log "${GREEN}✓ Git user configured${NC}"
    fi
}

# Function to install dependencies
install_dependencies() {
    log "${YELLOW}Installing project dependencies...${NC}"
    
    if npm install; then
        log "${GREEN}✓ Dependencies installed successfully${NC}"
    else
        log "${RED}✗ Failed to install dependencies${NC}"
        exit 1
    fi
}

# Function to create initial commit
create_initial_commit() {
    log "${YELLOW}Creating initial commit...${NC}"
    
    # Add all files
    git add .
    
    # Create initial commit
    if git commit -m "🚀 Initial AI Workspace setup with auto-commit system"; then
        log "${GREEN}✓ Initial commit created${NC}"
    else
        log "${YELLOW}No changes to commit${NC}"
    fi
}

# Function to push to repositories
push_to_repositories() {
    log "${YELLOW}Pushing to repositories...${NC}"
    
    # Push to main repository
    if git push -u origin main; then
        log "${GREEN}✓ Successfully pushed to main repository${NC}"
    else
        log "${RED}✗ Failed to push to main repository${NC}"
        log "${YELLOW}You may need to authenticate with GitHub${NC}"
    fi
    
    # Push to backup repository
    if git push -u backup main; then
        log "${GREEN}✓ Successfully pushed to backup repository${NC}"
    else
        log "${RED}✗ Failed to push to backup repository${NC}"
    fi
}

# Function to create development scripts
create_dev_scripts() {
    log "${YELLOW}Creating development scripts...${NC}"
    
    # Create a development start script
    cat > dev-start.sh << 'EOF'
#!/bin/bash

# Development start script
echo "🚀 Starting AI Workspace Development Environment"

# Start the development server
npm run dev &

# Start auto-commit in background
echo "🤖 Starting auto-commit monitoring..."
npm run auto-commit:start &

# Store background process IDs
echo $! > .dev-pid
echo $! > .auto-commit-pid

echo "✅ Development environment started!"
echo "📱 App running at: http://localhost:3000"
echo "🤖 Auto-commit monitoring active"
echo ""
echo "To stop everything: npm run dev:stop"
EOF

    chmod +x dev-start.sh
    
    # Create a stop script
    cat > dev-stop.sh << 'EOF'
#!/bin/bash

# Stop development environment
echo "🛑 Stopping AI Workspace Development Environment"

# Stop auto-commit
npm run auto-commit:stop

# Kill background processes
if [ -f .dev-pid ]; then
    kill $(cat .dev-pid) 2>/dev/null
    rm .dev-pid
fi

if [ -f .auto-commit-pid ]; then
    kill $(cat .auto-commit-pid) 2>/dev/null
    rm .auto-commit-pid
fi

# Kill any remaining node processes for this project
pkill -f "next dev" 2>/dev/null

echo "✅ Development environment stopped!"
EOF

    chmod +x dev-stop.sh
    
    log "${GREEN}✓ Development scripts created${NC}"
}

# Function to update package.json scripts
update_package_scripts() {
    log "${YELLOW}Updating package.json scripts...${NC}"
    
    # Add development scripts to package.json
    if ! grep -q "dev:start" package.json; then
        # Add new scripts to package.json
        sed -i '' '/"setup-repos":/a\
    "dev:start": "./dev-start.sh",\
    "dev:stop": "./dev-stop.sh",\
    "dev:restart": "npm run dev:stop && npm run dev:start",\
    "status": "echo \"📊 Project Status:\" && echo \"- Git remotes:\" && git remote -v && echo \"- Auto-commit:\" && ps aux | grep auto-commit.sh | grep -v grep || echo \"Not running\"",\
    "backup": "git push backup main",\
    "pull-all": "git pull origin main && git pull backup main",\
    "clean": "rm -rf .next node_modules package-lock.json && npm install",\
    "deploy": "npm run build && npm run sync"' package.json
    fi
    
    log "${GREEN}✓ Package.json scripts updated${NC}"
}

# Function to create project documentation
create_documentation() {
    log "${YELLOW}Creating project documentation...${NC}"
    
    # Create a comprehensive README
    cat > PROJECT_SETUP.md << 'EOF'
# 🤖 AI Workspace Project - Complete Setup Guide

## 🚀 Quick Start

### 1. Development Environment
```bash
# Start development with auto-commit
npm run dev:start

# Stop development
npm run dev:stop

# Restart everything
npm run dev:restart
```

### 2. Auto-Commit System
```bash
# Start auto-commit monitoring
npm run auto-commit:start

# Stop auto-commit
npm run auto-commit:stop

# Manual sync
npm run sync
```

### 3. Repository Management
```bash
# Check status
npm run status

# Backup to secondary repo
npm run backup

# Pull from all repos
npm run pull-all
```

## 📁 Project Structure

```
├── app/                    # Next.js application
├── components/             # Reusable components
├── lib/                   # Utility libraries
├── hooks/                 # Custom React hooks
├── styles/                # Global styles
├── public/                # Static assets
├── auto-commit.sh         # Auto-commit script
├── dev-start.sh           # Development start script
├── dev-stop.sh            # Development stop script
└── setup-project.sh       # Project setup script
```

## 🔄 Auto-Commit Features

- **Dual Repository Sync**: Automatically syncs to both main and backup repositories
- **Smart Commit Messages**: Generates descriptive commit messages based on changes
- **Real-time Monitoring**: Watches for file changes every 30 seconds
- **Error Handling**: Robust error handling and logging
- **Background Operation**: Runs in background during development

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:start` | Start development + auto-commit |
| `npm run dev:stop` | Stop development environment |
| `npm run auto-commit:start` | Start auto-commit monitoring |
| `npm run auto-commit:stop` | Stop auto-commit monitoring |
| `npm run sync` | Manual sync to repositories |
| `npm run status` | Check project status |
| `npm run backup` | Backup to secondary repo |
| `npm run pull-all` | Pull from all repositories |
| `npm run clean` | Clean and reinstall dependencies |
| `npm run deploy` | Build and deploy |

## 🔧 Configuration

### Auto-Commit Settings
- **Watch Interval**: 30 seconds
- **Commit Prefix**: "🤖 Auto-sync:"
- **Repositories**: Main + Backup sync

### Development Settings
- **Port**: 3000 (Next.js default)
- **Hot Reload**: Enabled
- **Auto-commit**: Background monitoring

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Manual Deployment
```bash
npm run build
npm run deploy
```

## 📊 Monitoring

### Development Status
```bash
npm run status
```

### Auto-Commit Logs
The auto-commit script provides real-time logging with timestamps and color-coded messages.

### Repository Status
```bash
git remote -v
git status
```

## 🔒 Security

- **Git Authentication**: Uses SSH keys or GitHub tokens
- **Environment Variables**: Store sensitive data in `.env.local`
- **Backup Strategy**: Dual repository sync for redundancy

## 🆘 Troubleshooting

### Common Issues

1. **Auto-commit not working**
   ```bash
   npm run auto-commit:stop
   npm run auto-commit:start
   ```

2. **Git authentication issues**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Port conflicts**
   ```bash
   lsof -ti:3000 | xargs kill -9
   npm run dev:start
   ```

4. **Dependency issues**
   ```bash
   npm run clean
   npm install
   ```

## 📈 Next Steps

1. **Customize AI Models**: Add your preferred AI models to the workspace
2. **Configure Prompts**: Set up your system prompts and tools
3. **Add Authentication**: Implement user authentication system
4. **Setup Database**: Add PostgreSQL with Prisma
5. **Add Billing**: Integrate Stripe for SaaS monetization
6. **Deploy**: Deploy to Vercel or your preferred platform

## 🎯 Success Metrics

- ✅ Auto-commit system working
- ✅ Dual repository sync active
- ✅ Development environment stable
- ✅ Ready for SaaS development
- ✅ Scalable architecture in place

---

**Happy Coding! 🚀**
EOF

    log "${GREEN}✓ Project documentation created${NC}"
}

# Function to show final status
show_final_status() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    SETUP COMPLETE! 🎉                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${GREEN}✅ Project Setup Summary:${NC}"
    echo -e "${GREEN}  ✓ Git repository configured${NC}"
    echo -e "${GREEN}  ✓ Dependencies installed${NC}"
    echo -e "${GREEN}  ✓ Auto-commit system ready${NC}"
    echo -e "${GREEN}  ✓ Development scripts created${NC}"
    echo -e "${GREEN}  ✓ Documentation generated${NC}"
    echo ""
    
    echo -e "${YELLOW}🚀 Next Steps:${NC}"
    echo -e "${YELLOW}  1. Start development: npm run dev:start${NC}"
    echo -e "${YELLOW}  2. Open browser: http://localhost:3000${NC}"
    echo -e "${YELLOW}  3. Begin building your AI SaaS!${NC}"
    echo ""
    
    echo -e "${BLUE}📚 Useful Commands:${NC}"
    echo -e "${BLUE}  npm run dev:start    - Start development + auto-commit${NC}"
    echo -e "${BLUE}  npm run dev:stop     - Stop development environment${NC}"
    echo -e "${BLUE}  npm run status       - Check project status${NC}"
    echo -e "${BLUE}  npm run sync         - Manual sync to repositories${NC}"
    echo ""
    
    echo -e "${PURPLE}🎯 Your AI Workspace is ready for the next level!${NC}"
}

# Main setup function
main() {
    show_banner
    
    # Check prerequisites
    check_prerequisites
    
    # Setup git
    setup_git
    
    # Install dependencies
    install_dependencies
    
    # Create initial commit
    create_initial_commit
    
    # Push to repositories
    push_to_repositories
    
    # Create development scripts
    create_dev_scripts
    
    # Update package.json
    update_package_scripts
    
    # Create documentation
    create_documentation
    
    # Show final status
    show_final_status
}

# Run main function
main 