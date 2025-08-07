#!/bin/bash

# Auto-commit script for AI Workspace Project
# Monitors changes and automatically commits to both repositories

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_NAME="All-in-One-AI-WorkSpace"
BACKUP_REPO="systempromptsandmodelsofaitools"
COMMIT_MESSAGE_PREFIX="🤖 Auto-sync:"
WATCH_INTERVAL=30 # seconds

# Function to log messages
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to check if there are changes
check_changes() {
    if ! git diff-index --quiet HEAD --; then
        return 0 # Changes exist
    else
        return 1 # No changes
    fi
}

# Function to get staged files
get_staged_files() {
    git diff --cached --name-only
}

# Function to get unstaged files
get_unstaged_files() {
    git diff --name-only
}

# Function to create commit message
create_commit_message() {
    local staged_files=$(get_staged_files)
    local unstaged_files=$(get_unstaged_files)
    
    local message="$COMMIT_MESSAGE_PREFIX "
    
    if [ ! -z "$staged_files" ]; then
        message+="Updated: $(echo "$staged_files" | head -3 | tr '\n' ', ' | sed 's/,$//')"
        if [ $(echo "$staged_files" | wc -l) -gt 3 ]; then
            message+=" and $(( $(echo "$staged_files" | wc -l) - 3 )) more files"
        fi
    fi
    
    if [ ! -z "$unstaged_files" ]; then
        if [ ! -z "$staged_files" ]; then
            message+=" | "
        fi
        message+="Modified: $(echo "$unstaged_files" | head -3 | tr '\n' ', ' | sed 's/,$//')"
        if [ $(echo "$unstaged_files" | wc -l) -gt 3 ]; then
            message+=" and $(( $(echo "$unstaged_files" | wc -l) - 3 )) more files"
        fi
    fi
    
    echo "$message"
}

# Function to commit changes
commit_changes() {
    local commit_msg=$(create_commit_message)
    
    log "${YELLOW}Detected changes, committing...${NC}"
    
    # Add all changes
    git add .
    
    # Commit with generated message
    if git commit -m "$commit_msg"; then
        log "${GREEN}✓ Successfully committed changes${NC}"
        return 0
    else
        log "${RED}✗ Failed to commit changes${NC}"
        return 1
    fi
}

# Function to push to repositories
push_changes() {
    log "${YELLOW}Pushing to repositories...${NC}"
    
    # Push to main repository
    if git push origin main; then
        log "${GREEN}✓ Successfully pushed to $REPO_NAME${NC}"
    else
        log "${RED}✗ Failed to push to $REPO_NAME${NC}"
        return 1
    fi
    
    # Push to backup repository
    if git push backup main; then
        log "${GREEN}✓ Successfully pushed to $BACKUP_REPO${NC}"
    else
        log "${RED}✗ Failed to push to $BACKUP_REPO${NC}"
        return 1
    fi
    
    return 0
}

# Function to sync with remote repositories
sync_repositories() {
    log "${YELLOW}Syncing with remote repositories...${NC}"
    
    # Fetch latest changes
    git fetch origin
    git fetch backup
    
    # Check if we need to pull
    if [ "$(git rev-list HEAD...origin/main --count)" != "0" ]; then
        log "${YELLOW}Pulling latest changes from $REPO_NAME...${NC}"
        git pull origin main
    fi
    
    if [ "$(git rev-list HEAD...backup/main --count)" != "0" ]; then
        log "${YELLOW}Pulling latest changes from $BACKUP_REPO...${NC}"
        git pull backup main
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}=== AI Workspace Auto-Commit Status ===${NC}"
    echo -e "${GREEN}✓ Monitoring: $(pwd)${NC}"
    echo -e "${GREEN}✓ Main Repo: $REPO_NAME${NC}"
    echo -e "${GREEN}✓ Backup Repo: $BACKUP_REPO${NC}"
    echo -e "${GREEN}✓ Watch Interval: ${WATCH_INTERVAL}s${NC}"
    echo -e "${GREEN}✓ Auto-commit: Enabled${NC}"
    echo ""
}

# Main monitoring loop
monitor_changes() {
    log "${GREEN}Starting auto-commit monitoring...${NC}"
    show_status
    
    while true; do
        # Check for changes
        if check_changes; then
            log "${YELLOW}Changes detected!${NC}"
            
            # Commit changes
            if commit_changes; then
                # Push to repositories
                if push_changes; then
                    log "${GREEN}✓ All changes synchronized successfully!${NC}"
                else
                    log "${RED}✗ Failed to push changes${NC}"
                fi
            else
                log "${RED}✗ Failed to commit changes${NC}"
            fi
        else
            log "${GREEN}No changes detected${NC}"
        fi
        
        # Wait before next check
        sleep $WATCH_INTERVAL
    done
}

# Function to handle script interruption
cleanup() {
    log "${YELLOW}Auto-commit monitoring stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check if remotes are configured
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${RED}Error: Origin remote not configured${NC}"
    exit 1
fi

if ! git remote get-url backup > /dev/null 2>&1; then
    echo -e "${RED}Error: Backup remote not configured${NC}"
    exit 1
fi

# Start monitoring
monitor_changes 