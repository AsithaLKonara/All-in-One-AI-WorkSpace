import crypto from "crypto"

export interface PayHereConfig {
  merchantId: string
  merchantSecret: string
  currency: string
  sandbox: boolean
}

export interface PaymentData {
  orderId: string
  amount: number
  description: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
}

export class PayHereService {
  private config: PayHereConfig

  constructor(config: PayHereConfig) {
    this.config = config
  }

  generateHash(paymentData: PaymentData): string {
    const { merchantId, orderId, amount, currency, merchantSecret } = {
      merchantId: this.config.merchantId,
      orderId: paymentData.orderId,
      amount: paymentData.amount.toFixed(2),
      currency: this.config.currency,
      merchantSecret: this.config.merchantSecret,
    }

    const hashString = `${merchantId}${orderId}${amount}${currency}${merchantSecret}`
    return crypto.createHash("md5").update(hashString).digest("hex").toUpperCase()
  }

  verifyPayment(
    merchantId: string,
    orderId: string,
    paymentId: string,
    amount: string,
    currency: string,
    statusCode: string,
    hash: string,
  ): boolean {
    const localHash = crypto
      .createHash("md5")
      .update(`${merchantId}${orderId}${amount}${currency}${statusCode}${this.config.merchantSecret}`)
      .digest("hex")
      .toUpperCase()

    return localHash === hash
  }

  getPaymentUrl(): string {
    return this.config.sandbox ? "https://sandbox.payhere.lk/pay/checkout" : "https://www.payhere.lk/pay/checkout"
  }

  createPaymentForm(paymentData: PaymentData): string {
    const hash = this.generateHash(paymentData)
    const paymentUrl = this.getPaymentUrl()

    return `
      <form method="post" action="${paymentUrl}" id="payhere-payment">
        <input type="hidden" name="merchant_id" value="${this.config.merchantId}">
        <input type="hidden" name="return_url" value="${process.env.NEXTAUTH_URL}/dashboard/billing?success=true">
        <input type="hidden" name="cancel_url" value="${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true">
        <input type="hidden" name="notify_url" value="${process.env.NEXTAUTH_URL}/api/payments/webhook">
        <input type="hidden" name="order_id" value="${paymentData.orderId}">
        <input type="hidden" name="items" value="${paymentData.description}">
        <input type="hidden" name="currency" value="${this.config.currency}">
        <input type="hidden" name="amount" value="${paymentData.amount.toFixed(2)}">
        <input type="hidden" name="first_name" value="${paymentData.firstName}">
        <input type="hidden" name="last_name" value="${paymentData.lastName}">
        <input type="hidden" name="email" value="${paymentData.email}">
        <input type="hidden" name="phone" value="${paymentData.phone}">
        <input type="hidden" name="address" value="${paymentData.address}">
        <input type="hidden" name="city" value="${paymentData.city}">
        <input type="hidden" name="country" value="${paymentData.country}">
        <input type="hidden" name="hash" value="${hash}">
      </form>
    `
  }
}

export const payHereService = new PayHereService({
  merchantId: process.env.PAYHERE_MERCHANT_ID || "",
  merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || "",
  currency: "USD",
  sandbox: process.env.NODE_ENV !== "production",
})
