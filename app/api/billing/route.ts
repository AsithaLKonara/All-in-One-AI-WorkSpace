import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { stripeService, subscriptionService, SUBSCRIPTION_PLANS } from "@/app/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscriptions: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const subscription = user.subscriptions[0]
    const currentPlan = subscription?.plan || "free"
    const planDetails = SUBSCRIPTION_PLANS[currentPlan as keyof typeof SUBSCRIPTION_PLANS]
    const limits = await subscriptionService.getUserLimits(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      subscription: subscription ? {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
      } : null,
      plan: {
        id: planDetails.id,
        name: planDetails.name,
        price: planDetails.price,
        features: planDetails.features,
        limits
      },
      availablePlans: Object.values(SUBSCRIPTION_PLANS)
    })

  } catch (error) {
    console.error("GET /api/billing error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { planId, successUrl, cancelUrl } = body

    if (!planId || !SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscriptions: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]
    
    // If it's a free plan, just update the subscription
    if (planId === "free") {
      if (user.subscriptions[0]) {
        await prisma.subscription.update({
          where: { id: user.subscriptions[0].id },
          data: { plan: "free", status: "active" }
        })
      } else {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            plan: "free",
            status: "active"
          }
        })
      }

      return NextResponse.json({ success: true, plan: "free" })
    }

    // For paid plans, create Stripe checkout session
    let customerId = user.subscriptions[0]?.stripeCustomerId

    if (!customerId) {
      // Create new customer
      const customer = await stripeService.createCustomer(user.email!, user.name)
      customerId = customer.id
    }

    // Create checkout session
    const session = await stripeService.createCheckoutSession(
      customerId,
      plan.stripePriceId!,
      successUrl || `${process.env.NEXTAUTH_URL}/billing?success=true`,
      cancelUrl || `${process.env.NEXTAUTH_URL}/billing?canceled=true`
    )

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error("POST /api/billing error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, planId } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscriptions: true }
    })

    if (!user || !user.subscriptions[0]) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    const subscription = user.subscriptions[0]

    switch (action) {
      case "cancel":
        if (subscription.stripeSubscriptionId) {
          await stripeService.cancelSubscription(subscription.stripeSubscriptionId)
        } else {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: "canceled" }
          })
        }
        break

      case "reactivate":
        if (subscription.stripeSubscriptionId) {
          await stripeService.reactivateSubscription(subscription.stripeSubscriptionId)
        } else {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: "active" }
          })
        }
        break

      case "upgrade":
        if (!planId || !SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]) {
          return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
        }

        const newPlan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]
        
        if (subscription.stripeSubscriptionId && newPlan.stripePriceId) {
          await stripeService.updateSubscription(subscription.stripeSubscriptionId, newPlan.stripePriceId)
        } else {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { plan: planId }
          })
        }
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("PATCH /api/billing error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 