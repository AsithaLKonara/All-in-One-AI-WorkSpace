import Stripe from "stripe"
import { prisma } from "./prisma"

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "1 workspace",
      "2 AI agents",
      "100 messages/month",
      "Basic analytics",
      "Community support"
    ],
    limits: {
      workspaces: 1,
      agents: 2,
      messagesPerMonth: 100,
      exportEnabled: false,
      advancedAnalytics: false,
      apiAccess: false
    }
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 29,
    stripePriceId: "price_pro_monthly",
    features: [
      "Unlimited workspaces",
      "Unlimited AI agents",
      "Unlimited messages",
      "Advanced analytics",
      "Export conversations",
      "Priority support",
      "Custom AI models"
    ],
    limits: {
      workspaces: -1, // unlimited
      agents: -1, // unlimited
      messagesPerMonth: -1, // unlimited
      exportEnabled: true,
      advancedAnalytics: true,
      apiAccess: false
    }
  },
  team: {
    id: "team",
    name: "Team",
    price: 99,
    stripePriceId: "price_team_monthly",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared agent pool",
      "Advanced analytics",
      "API access",
      "White-label options",
      "Dedicated support"
    ],
    limits: {
      workspaces: -1, // unlimited
      agents: -1, // unlimited
      messagesPerMonth: -1, // unlimited
      exportEnabled: true,
      advancedAnalytics: true,
      apiAccess: true,
      teamMembers: 10
    }
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    stripePriceId: "price_enterprise_monthly",
    features: [
      "Everything in Team",
      "Unlimited team members",
      "Custom integrations",
      "SLA guarantee",
      "On-premise options",
      "Custom AI training",
      "Dedicated account manager"
    ],
    limits: {
      workspaces: -1, // unlimited
      agents: -1, // unlimited
      messagesPerMonth: -1, // unlimited
      exportEnabled: true,
      advancedAnalytics: true,
      apiAccess: true,
      teamMembers: -1 // unlimited
    }
  }
}

// Stripe Service Class
export class StripeService {
  // Create a customer
  async createCustomer(email: string, name?: string) {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: "ai-workspace"
      }
    })

    return customer
  }

  // Create a subscription
  async createSubscription(customerId: string, priceId: string) {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    })

    return subscription
  }

  // Update subscription
  async updateSubscription(subscriptionId: string, priceId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    })

    return updatedSubscription
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return subscription
  }

  // Reactivate subscription
  async reactivateSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    return subscription
  }

  // Create checkout session
  async createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string) {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        source: "ai-workspace"
      }
    })

    return session
  }

  // Create portal session
  async createPortalSession(customerId: string, returnUrl: string) {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session
  }

  // Get customer
  async getCustomer(customerId: string) {
    const customer = await stripe.customers.retrieve(customerId)
    return customer
  }

  // Get subscription
  async getSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  }

  // Get invoice
  async getInvoice(invoiceId: string) {
    const invoice = await stripe.invoices.retrieve(invoiceId)
    return invoice
  }

  // Create usage record
  async createUsageRecord(subscriptionItemId: string, quantity: number, timestamp: number) {
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity,
        timestamp,
        action: "increment",
      }
    )

    return usageRecord
  }
}

// Database integration
export class SubscriptionService {
  // Create or update subscription in database
  async upsertSubscription(userId: string, stripeData: any) {
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        stripeCustomerId: stripeData.customer,
        stripeSubscriptionId: stripeData.id,
        plan: this.getPlanFromPriceId(stripeData.items.data[0].price.id),
        status: stripeData.status,
        currentPeriodStart: new Date(stripeData.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeData.current_period_end * 1000),
        cancelAtPeriodEnd: stripeData.cancel_at_period_end,
      },
      create: {
        userId,
        stripeCustomerId: stripeData.customer,
        stripeSubscriptionId: stripeData.id,
        plan: this.getPlanFromPriceId(stripeData.items.data[0].price.id),
        status: stripeData.status,
        currentPeriodStart: new Date(stripeData.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeData.current_period_end * 1000),
        cancelAtPeriodEnd: stripeData.cancel_at_period_end,
      },
    })

    return subscription
  }

  // Get user subscription
  async getUserSubscription(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    return subscription
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId: string) {
    const subscription = await this.getUserSubscription(userId)
    return subscription && subscription.status === "active"
  }

  // Get user plan limits
  async getUserLimits(userId: string) {
    const subscription = await this.getUserSubscription(userId)
    const planId = subscription?.plan || "free"
    return SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS].limits
  }

  // Check if user can perform action
  async canPerformAction(userId: string, action: string) {
    const limits = await this.getUserLimits(userId)
    
    switch (action) {
      case "create_workspace":
        return limits.workspaces === -1 || await this.getUserWorkspaceCount(userId) < limits.workspaces
      case "create_agent":
        return limits.agents === -1 || await this.getUserAgentCount(userId) < limits.agents
      case "send_message":
        return limits.messagesPerMonth === -1 || await this.getUserMessageCount(userId) < limits.messagesPerMonth
      case "export_conversation":
        return limits.exportEnabled
      case "access_analytics":
        return limits.advancedAnalytics
      case "api_access":
        return limits.apiAccess
      default:
        return false
    }
  }

  // Helper methods
  private getPlanFromPriceId(priceId: string): string {
    for (const [planId, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
      if (plan.stripePriceId === priceId) {
        return planId
      }
    }
    return "free"
  }

  private async getUserWorkspaceCount(userId: string): Promise<number> {
    return await prisma.workspace.count({ where: { userId } })
  }

  private async getUserAgentCount(userId: string): Promise<number> {
    return await prisma.agent.count({ where: { userId } })
  }

  private async getUserMessageCount(userId: string): Promise<number> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    return await prisma.userAnalytics.count({
      where: {
        userId,
        eventType: "chat_message",
        createdAt: { gte: thirtyDaysAgo }
      }
    })
  }
}

// Export instances
export const stripeService = new StripeService()
export const subscriptionService = new SubscriptionService() 