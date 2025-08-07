// Production Configuration
export const PRODUCTION_CONFIG = {
  // Database
  database: {
    url: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
    },
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    providers: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      },
    },
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  // AI Services
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY,
    },
  },

  // Email
  email: {
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    user: process.env.EMAIL_SERVER_USER,
    password: process.env.EMAIL_SERVER_PASSWORD,
    from: process.env.EMAIL_FROM,
  },

  // Redis (for caching and sessions)
  redis: {
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  },

  // CDN and Storage
  storage: {
    bucket: process.env.STORAGE_BUCKET,
    region: process.env.STORAGE_REGION,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    },
    analytics: {
      googleAnalytics: process.env.GA_MEASUREMENT_ID,
      mixpanel: process.env.MIXPANEL_TOKEN,
    },
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP",
  },

  // Security
  security: {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
      credentials: true,
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    },
  },

  // Performance
  performance: {
    compression: true,
    caching: {
      static: "public, max-age=31536000, immutable",
      api: "public, max-age=300",
    },
  },

  // Feature Flags
  features: {
    analytics: process.env.ENABLE_ANALYTICS === "true",
    billing: process.env.ENABLE_BILLING === "true",
    collaboration: process.env.ENABLE_COLLABORATION === "true",
    api: process.env.ENABLE_API === "true",
  },
}

// Environment validation
export function validateEnvironment() {
  const required = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "STRIPE_SECRET_KEY",
    "OPENAI_API_KEY",
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return true
}

// Production utilities
export const PRODUCTION_UTILS = {
  // Check if running in production
  isProduction: () => process.env.NODE_ENV === "production",

  // Get environment-specific config
  getConfig: (key: string) => {
    return PRODUCTION_CONFIG[key as keyof typeof PRODUCTION_CONFIG]
  },

  // Validate production setup
  validateProductionSetup: () => {
    if (PRODUCTION_UTILS.isProduction()) {
      validateEnvironment()
      
      // Additional production checks
      if (!process.env.SENTRY_DSN) {
        console.warn("Sentry DSN not configured - error tracking disabled")
      }
      
      if (!process.env.REDIS_URL) {
        console.warn("Redis URL not configured - using in-memory sessions")
      }
    }
  },

  // Get feature flag
  isFeatureEnabled: (feature: string) => {
    return PRODUCTION_CONFIG.features[feature as keyof typeof PRODUCTION_CONFIG.features] || false
  },
} 