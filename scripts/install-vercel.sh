#!/bin/bash

echo "🚀 Installing Vercel CLI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install Vercel CLI globally
echo "📦 Installing Vercel CLI globally..."
npm install -g vercel

# Check if installation was successful
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI installed successfully!"
    echo "📍 Vercel CLI is now available globally"
    echo ""
    echo "Next steps:"
    echo "1. Run 'vercel login' to authenticate"
    echo "2. Run 'vercel --prod' to deploy your project"
    echo ""
    vercel --version
else
    echo "❌ Vercel CLI installation failed"
    echo "Try running with sudo: sudo npm install -g vercel"
    exit 1
fi
