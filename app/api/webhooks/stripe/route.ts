import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe, subscriptionService } from "@/app/lib/stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object)
        break

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object)
        break

      case "customer.created":
        await handleCustomerCreated(event.data.object)
        break

      case "customer.updated":
        await handleCustomerUpdated(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log("Subscription created:", subscription.id)
  
  // Find user by customer ID
  const user = await prisma.user.findFirst({
    where: { subscriptions: { some: { stripeCustomerId: subscription.customer } } }
  })

  if (user) {
    await subscriptionService.upsertSubscription(user.id, subscription)
    
    // Track analytics
    await prisma.userAnalytics.create({
      data: {
        userId: user.id,
        eventType: "subscription_created",
        metadata: {
          subscriptionId: subscription.id,
          plan: subscriptionService.getPlanFromPriceId(subscription.items.data[0].price.id),
          amount: subscription.items.data[0].price.unit_amount / 100
        }
      }
    })
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log("Subscription updated:", subscription.id)
  
  const user = await prisma.user.findFirst({
    where: { subscriptions: { some: { stripeCustomerId: subscription.customer } } }
  })

  if (user) {
    await subscriptionService.upsertSubscription(user.id, subscription)
    
    // Track analytics
    await prisma.userAnalytics.create({
      data: {
        userId: user.id,
        eventType: "subscription_updated",
        metadata: {
          subscriptionId: subscription.id,
          plan: subscriptionService.getPlanFromPriceId(subscription.items.data[0].price.id),
          status: subscription.status
        }
      }
    })
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log("Subscription deleted:", subscription.id)
  
  const user = await prisma.user.findFirst({
    where: { subscriptions: { some: { stripeCustomerId: subscription.customer } } }
  })

  if (user) {
    // Update subscription status
    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        status: "canceled",
        cancelAtPeriodEnd: true
      }
    })
    
    // Track analytics
    await prisma.userAnalytics.create({
      data: {
        userId: user.id,
        eventType: "subscription_canceled",
        metadata: {
          subscriptionId: subscription.id,
          canceledAt: new Date().toISOString()
        }
      }
    })
  }
}

async function handlePaymentSucceeded(invoice: any) {
  console.log("Payment succeeded:", invoice.id)
  
  const user = await prisma.user.findFirst({
    where: { subscriptions: { some: { stripeCustomerId: invoice.customer } } }
  })

  if (user) {
    // Track analytics
    await prisma.userAnalytics.create({
      data: {
        userId: user.id,
        eventType: "payment_succeeded",
        metadata: {
          invoiceId: invoice.id,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency
        }
      }
    })
  }
}

async function handlePaymentFailed(invoice: any) {
  console.log("Payment failed:", invoice.id)
  
  const user = await prisma.user.findFirst({
    where: { subscriptions: { some: { stripeCustomerId: invoice.customer } } }
  })

  if (user) {
    // Track analytics
    await prisma.userAnalytics.create({
      data: {
        userId: user.id,
        eventType: "payment_failed",
        metadata: {
          invoiceId: invoice.id,
          amount: invoice.amount_due / 100,
          currency: invoice.currency,
          failureReason: invoice.last_finalization_error?.message
        }
      }
    })
  }
}

async function handleCustomerCreated(customer: any) {
  console.log("Customer created:", customer.id)
  
  // Track analytics if we have user info
  if (customer.email) {
    const user = await prisma.user.findUnique({
      where: { email: customer.email }
    })

    if (user) {
      await prisma.userAnalytics.create({
        data: {
          userId: user.id,
          eventType: "stripe_customer_created",
          metadata: {
            customerId: customer.id,
            email: customer.email
          }
        }
      })
    }
  }
}

async function handleCustomerUpdated(customer: any) {
  console.log("Customer updated:", customer.id)
  
  // Track analytics if we have user info
  if (customer.email) {
    const user = await prisma.user.findUnique({
      where: { email: customer.email }
    })

    if (user) {
      await prisma.userAnalytics.create({
        data: {
          userId: user.id,
          eventType: "stripe_customer_updated",
          metadata: {
            customerId: customer.id,
            email: customer.email
          }
        }
      })
    }
  }
} 