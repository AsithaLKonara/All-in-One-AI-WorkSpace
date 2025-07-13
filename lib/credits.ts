import { getSupabaseClient } from "./supabase"
import { getModelCreditCost } from "./credit-plans"

export interface CreditBalance {
  userId: string
  totalCredits: number
  usedCredits: number
  remainingCredits: number
  lastUpdated: Date
}

export interface CreditUsage {
  id: string
  userId: string
  modelId: string
  creditsUsed: number
  tokensUsed: number
  requestType: string
  createdAt: Date
}

export interface CreditPurchase {
  id: string
  userId: string
  planId: string
  credits: number
  amount: number
  currency: string
  paymentId: string
  status: "pending" | "completed" | "failed"
  createdAt: Date
}

export class CreditsManager {
  private supabase = getSupabaseClient()

  async getUserCredits(userId: string): Promise<CreditBalance | null> {
    try {
      const { data, error } = await this.supabase.from("user_credits").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (!data) {
        // Initialize credits for new user
        return await this.initializeUserCredits(userId)
      }

      return {
        userId: data.user_id,
        totalCredits: data.total_credits,
        usedCredits: data.used_credits,
        remainingCredits: data.total_credits - data.used_credits,
        lastUpdated: new Date(data.updated_at),
      }
    } catch (error) {
      console.error("Error getting user credits:", error)
      return null
    }
  }

  async initializeUserCredits(userId: string): Promise<CreditBalance> {
    const initialCredits = 10 // Free credits for new users

    const { data, error } = await this.supabase
      .from("user_credits")
      .insert({
        user_id: userId,
        total_credits: initialCredits,
        used_credits: 0,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      userId: data.user_id,
      totalCredits: data.total_credits,
      usedCredits: data.used_credits,
      remainingCredits: data.total_credits - data.used_credits,
      lastUpdated: new Date(data.updated_at),
    }
  }

  async deductCredits(userId: string, modelId: string, tokensUsed: number, requestType = "chat"): Promise<boolean> {
    const creditsRequired = getModelCreditCost(modelId)

    try {
      // Check if user has enough credits
      const balance = await this.getUserCredits(userId)
      if (!balance || balance.remainingCredits < creditsRequired) {
        return false
      }

      // Deduct credits
      const { error: updateError } = await this.supabase
        .from("user_credits")
        .update({
          used_credits: balance.usedCredits + creditsRequired,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (updateError) {
        throw updateError
      }

      // Log usage
      await this.logCreditUsage(userId, modelId, creditsRequired, tokensUsed, requestType)

      return true
    } catch (error) {
      console.error("Error deducting credits:", error)
      return false
    }
  }

  async addCredits(userId: string, credits: number, purchaseId?: string): Promise<boolean> {
    try {
      const balance = await this.getUserCredits(userId)
      if (!balance) {
        throw new Error("User credits not found")
      }

      const { error } = await this.supabase
        .from("user_credits")
        .update({
          total_credits: balance.totalCredits + credits,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error("Error adding credits:", error)
      return false
    }
  }

  async logCreditUsage(
    userId: string,
    modelId: string,
    creditsUsed: number,
    tokensUsed: number,
    requestType: string,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.from("credit_usage").insert({
        user_id: userId,
        model_id: modelId,
        credits_used: creditsUsed,
        tokens_used: tokensUsed,
        request_type: requestType,
        created_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error logging credit usage:", error)
    }
  }

  async getCreditUsageHistory(userId: string, limit = 50): Promise<CreditUsage[]> {
    try {
      const { data, error } = await this.supabase
        .from("credit_usage")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        modelId: item.model_id,
        creditsUsed: item.credits_used,
        tokensUsed: item.tokens_used,
        requestType: item.request_type,
        createdAt: new Date(item.created_at),
      }))
    } catch (error) {
      console.error("Error getting credit usage history:", error)
      return []
    }
  }

  async recordPurchase(
    userId: string,
    planId: string,
    credits: number,
    amount: number,
    currency: string,
    paymentId: string,
  ): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from("credit_purchases")
        .insert({
          user_id: userId,
          plan_id: planId,
          credits: credits,
          amount: amount,
          currency: currency,
          payment_id: paymentId,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data.id
    } catch (error) {
      console.error("Error recording purchase:", error)
      return null
    }
  }

  async completePurchase(purchaseId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from("credit_purchases")
        .update({ status: "completed" })
        .eq("id", purchaseId)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Add credits to user account
      await this.addCredits(data.user_id, data.credits, purchaseId)

      return true
    } catch (error) {
      console.error("Error completing purchase:", error)
      return false
    }
  }
}

export const CreditManager = new CreditsManager()
