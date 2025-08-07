import { type NextRequest, NextResponse } from "next/server"
import { PayHereService } from "@/lib/payhere"
import { CreditManager } from "@/lib/credits"
import { createClient } from "@supabase/supabase-js"

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables not configured")
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const formData = await request.formData()

    const merchant_id = formData.get("merchant_id") as string
    const order_id = formData.get("order_id") as string
    const payhere_amount = Number.parseFloat(formData.get("payhere_amount") as string)
    const payhere_currency = formData.get("payhere_currency") as string
    const status_code = Number.parseInt(formData.get("status_code") as string)
    const md5sig = formData.get("md5sig") as string

    const payhere = new PayHereService({
      merchantId: process.env.PAYHERE_MERCHANT_ID || "",
      merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || "",
      currency: "USD",
      sandbox: process.env.NODE_ENV !== "production",
    })
    const isValid = payhere.verifyPayment(merchant_id, order_id, "", payhere_amount.toString(), payhere_currency, status_code.toString(), md5sig)

    if (!isValid) {
      console.error("Invalid payment verification")
      return NextResponse.json({ error: "Invalid payment" }, { status: 400 })
    }

    const { data: pendingPayment } = await supabase
      .from("pending_payments")
      .select("*")
      .eq("order_id", order_id)
      .single()

    if (!pendingPayment) {
      console.error("Pending payment not found:", order_id)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (status_code === 2) {
      await CreditManager.addCredits(
        pendingPayment.user_id,
        pendingPayment.credits,
      )

      await supabase.from("pending_payments").update({ status: "completed" }).eq("order_id", order_id)

      console.log(`Payment completed for order ${order_id}`)
    } else {
      await supabase.from("pending_payments").update({ status: "failed" }).eq("order_id", order_id)

      console.log(`Payment failed for order ${order_id}, status: ${status_code}`)
    }

    return NextResponse.json({ status: "OK" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
