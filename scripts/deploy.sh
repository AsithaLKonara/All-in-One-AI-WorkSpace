#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Building project..."
npm run build

echo "🚀 Deploying to production..."
# Use non-interactive mode with proper project name
vercel --prod --yes --name all-in-one-ai-workspace

echo "✅ Deployment complete!"
echo "🌐 Your live URL will be shown above"
