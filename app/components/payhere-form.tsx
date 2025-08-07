"use client"

import { useEffect, useRef } from "react"

interface PayHereFormProps {
  paymentData: any
  paymentUrl: string
  onSubmit?: () => void
}

export function PayHereForm({ paymentData, paymentUrl, onSubmit }: PayHereFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formRef.current && onSubmit) {
      onSubmit()
      formRef.current.submit()
    }
  }, [onSubmit])

  return (
    <form ref={formRef} method="post" action={paymentUrl} style={{ display: "none" }}>
      <input type="hidden" name="merchant_id" value={paymentData.merchant_id} />
      <input type="hidden" name="return_url" value={paymentData.return_url} />
      <input type="hidden" name="cancel_url" value={paymentData.cancel_url} />
      <input type="hidden" name="notify_url" value={paymentData.notify_url} />
      <input type="hidden" name="order_id" value={paymentData.order_id} />
      <input type="hidden" name="items" value={paymentData.items} />
      <input type="hidden" name="currency" value={paymentData.currency} />
      <input type="hidden" name="amount" value={paymentData.amount} />
      <input type="hidden" name="first_name" value={paymentData.first_name} />
      <input type="hidden" name="last_name" value={paymentData.last_name} />
      <input type="hidden" name="email" value={paymentData.email} />
      <input type="hidden" name="phone" value={paymentData.phone} />
      <input type="hidden" name="address" value={paymentData.address} />
      <input type="hidden" name="city" value={paymentData.city} />
      <input type="hidden" name="country" value={paymentData.country} />
      <input type="hidden" name="hash" value={paymentData.hash} />
    </form>
  )
}
