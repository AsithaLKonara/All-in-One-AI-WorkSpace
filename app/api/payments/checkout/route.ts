import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { PayHereService } from "@/lib/payhere"
import { CREDIT_PLANS } from "@/lib/credit-plans"

export async function POST(request: NextRequest) {
  try {
    const { planId, userDetails } = await request.json()

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const plan = CREDIT_PLANS.find((p) => p.id === planId)
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const payhere = new PayHereService()
    const orderId = `order_${Date.now()}_${user.id.slice(0, 8)}`

    await supabase.from("pending_payments").insert({
      order_id: orderId,
      user_id: user.id,
      plan_id: planId,
      amount: plan.price,
      credits: plan.credits,
      status: "pending",
    })

    const payment = payhere.createPayment(orderId, plan.price, `${plan.name} - ${plan.credits} Credits`, {
      firstName: userDetails.firstName || user.user_metadata?.first_name || "User",
      lastName: userDetails.lastName || user.user_metadata?.last_name || "Name",
      email: user.email!,
      phone: userDetails.phone || "0000000000",
      address: userDetails.address || "Address",
      city: userDetails.city || "City",
      country: userDetails.country || "US",
    })

    return NextResponse.json({
      paymentData: {
        merchant_id: process.env.PAYHERE_MERCHANT_ID,
        return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true&order=${orderId}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
        notify_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook`,
        currency: "USD",
        ...payment,
      },
      paymentUrl: payhere.getPaymentUrl(),
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
