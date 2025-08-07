export interface CreditPlan {
  id: string
  name: string
  credits: number
  price: number
  currency: string
  popular?: boolean
  features: string[]
  description: string
}

export const CREDIT_PLANS: CreditPlan[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 9.99,
    currency: "USD",
    description: "Perfect for trying out AI tools",
    features: ["100 AI credits", "Access to all AI models", "Basic support", "Credit usage analytics"],
  },
  {
    id: "professional",
    name: "Professional",
    credits: 500,
    price: 29.99,
    currency: "USD",
    popular: true,
    description: "Best value for regular users",
    features: [
      "500 AI credits",
      "Access to all AI models",
      "Priority support",
      "Advanced analytics",
      "Export chat history",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 2000,
    price: 99.99,
    currency: "USD",
    description: "For power users and teams",
    features: [
      "2000 AI credits",
      "Access to all AI models",
      "Premium support",
      "Advanced analytics",
      "Export chat history",
      "API access",
      "Custom integrations",
    ],
  },
]

export const MODEL_CREDIT_COSTS: Record<string, number> = {
  v0: 2,
  cursor: 3,
  bolt: 2,
  lovable: 4,
  devin: 5,
  cluely: 3,
  windsurf: 3,
  replit: 2,
  claude: 4,
  llama: 1,
  gpt4free: 1,
}

export function getCreditPlan(planId: string): CreditPlan | undefined {
  return CREDIT_PLANS.find((plan) => plan.id === planId)
}

export function getModelCreditCost(modelId: string): number {
  return MODEL_CREDIT_COSTS[modelId] || 1
}

export function calculateTokensFromCredits(credits: number, modelId: string): number {
  const creditCost = getModelCreditCost(modelId)
  return Math.floor(credits / creditCost) * 1000 // Assume 1000 tokens per credit unit
}
