#!/bin/bash

# AI UI Builder Deployment Script
echo "🚀 Deploying AI UI Builder..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check for build errors
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Run type check
echo "🔍 Running type check..."
npx tsc --noEmit --skipLibCheck

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your AI UI Builder is now live!"
echo "📝 Check the deployment URL above for your application." 