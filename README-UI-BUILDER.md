# AI UI Builder - Vercel v0-style Interface

A powerful, AI-driven UI builder that generates React components from natural language prompts using your existing AI models.

## 🚀 Features

### Core Functionality
- **Natural Language UI Generation**: Describe components in plain English
- **Multi-Model AI Support**: Claude, Devin, v0, Cursor, GPT-4 Free
- **Live Preview**: See generated components instantly
- **Drag & Drop Editor**: Reorder and manage components visually
- **AI-Powered Actions**: Fix, explain, optimize, and test code
- **Theme Support**: Light, dark, and system themes
- **Component Library**: Save and reuse generated components

### AI Models Integration
- **Claude**: Anthropic's helpful AI assistant
- **Devin AI**: Autonomous software engineering
- **v0 by Vercel**: React/Next.js UI generation specialist
- **Cursor Agent**: Advanced code editing and refactoring
- **GPT-4 Free**: Free GPT-4 access via open APIs

### UI Actions
- **Fix Code**: Identify and fix bugs, errors, and issues
- **Explain Code**: Get detailed explanations of component functionality
- **Optimize**: Improve performance, readability, and best practices
- **Generate Tests**: Create comprehensive unit tests
- **Enhance UI**: Improve styling, accessibility, and UX
- **Add Comments**: Document code with clear explanations

## 🏗️ Architecture

```
app/
├── components/
│   ├── PromptForm.tsx          # Natural language input form
│   ├── UIBlockPreview.tsx      # Live component preview
│   ├── Sidebar.tsx             # Component library & samples
│   ├── AIActionToolbar.tsx     # AI-powered code actions
│   ├── EditorWorkspace.tsx     # Drag & drop component editor
│   └── ThemeSwitcher.tsx       # Theme customization
├── api/
│   ├── generate-ui/route.ts    # UI generation endpoint
│   └── ai-action/route.ts      # AI action endpoint
├── utils/
│   └── fetchModel.ts           # AI model integration utilities
└── page.tsx                    # Main application
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Syntax Highlighting**: react-syntax-highlighter
- **AI Integration**: Custom model endpoints
- **State Management**: React hooks
- **Theming**: CSS variables with system preference detection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Existing AI model endpoints (Claude, Devin, v0, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-ui-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your AI model endpoints:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   # Add your AI model API keys/endpoints
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### 1. Generate UI Components

1. **Enter a prompt** in the natural language form
   ```
   "Create a modern login form with email and password fields"
   ```

2. **Select an AI model** based on your needs:
   - **v0**: Best for React/Next.js components
   - **Claude**: Great for complex logic and explanations
   - **Devin**: Excellent for architecture and best practices
   - **Cursor**: Perfect for code optimization
   - **GPT-4 Free**: Good for creative designs

3. **Review the generated component** in the live preview

### 2. Use AI Actions

After generating a component, use the AI Action Toolbar:

- **Fix Code**: Automatically resolves syntax errors
- **Explain Code**: Get detailed breakdown of functionality
- **Optimize**: Improve performance and readability
- **Generate Tests**: Create comprehensive test suites
- **Enhance UI**: Upgrade styling and accessibility
- **Add Comments**: Document code with explanations

### 3. Manage Components

- **Save components** to your library
- **Drag and drop** to reorder components
- **Duplicate components** for variations
- **Export components** as standalone files
- **Share projects** with others

### 4. Customize Themes

- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes
- **System Theme**: Follows OS preference

## 🔧 Configuration

### AI Model Endpoints

Configure your AI models in the API routes:

```typescript
// app/api/generate-ui/route.ts
const AI_MODELS = {
  claude: "/api/claude",
  devin: "/api/devin", 
  v0: "/api/v0",
  cursor: "/api/cursor",
  gpt4free: "/api/gpt4free"
}
```

### Custom Components

Add your own component templates:

```typescript
// app/components/Sidebar.tsx
const SAMPLE_COMPONENTS = [
  {
    id: "custom-component",
    name: "My Component",
    description: "Custom component template",
    jsx: "// Your JSX here",
    metadata: { /* ... */ }
  }
]
```

## 🎨 Customization

### Adding New AI Models

1. **Create API endpoint** in `app/api/`
2. **Update model list** in `PromptForm.tsx`
3. **Add integration** in `fetchModel.ts`

### Custom Themes

1. **Define CSS variables** in `globals.css`
2. **Update theme switcher** in `ThemeSwitcher.tsx`
3. **Add theme previews** in the UI

### Component Templates

1. **Add templates** to `Sidebar.tsx`
2. **Create categories** for organization
3. **Include metadata** for better search

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main

### Other Platforms

1. **Build the project**: `npm run build`
2. **Start production**: `npm start`
3. **Configure environment variables**

## 🔒 Security

- **Input validation** on all API endpoints
- **Rate limiting** for AI model calls
- **Error handling** for failed requests
- **Sanitization** of generated code
- **Sandboxed previews** for safety

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📊 Performance

- **Lazy loading** of components
- **Optimized bundle** with tree shaking
- **Caching** of AI responses
- **Debounced** user inputs
- **Virtual scrolling** for large lists

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests** for new functionality
5. **Submit a pull request**

### Development Guidelines

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Conventional commits** for version control

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Vercel** for the v0 inspiration
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **@dnd-kit** for drag and drop functionality

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: `/docs` folder
- **Examples**: `/examples` folder

---

**Built with ❤️ using Next.js, TypeScript, and AI** 