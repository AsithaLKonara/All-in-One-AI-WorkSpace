import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"
import { aiService, ChatMessage } from "@/app/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      messages,
      modelId,
      conversationId,
      agentId,
      workspaceId,
      options = {}
    } = body

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    if (!modelId || !aiService.isModelAvailable(modelId)) {
      return NextResponse.json({ error: "Invalid model ID" }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Process messages
    const chatMessages: ChatMessage[] = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date()
    }))

    // Get AI response
    const response = await aiService.chat(modelId, chatMessages, options)

    // Save conversation to database
    let conversation
    if (conversationId) {
      // Update existing conversation
      conversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          messages: [...messages, { role: "assistant", content: response.content }],
          updatedAt: new Date()
        }
      })
    } else {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          title: messages[0]?.content?.slice(0, 50) + "...",
          messages: [...messages, { role: "assistant", content: response.content }],
          userId: user.id,
          workspaceId: workspaceId || null,
          agentId: agentId || null
        }
      })
    }

    // Track analytics
    await prisma.userAnalytics.create({
      data: {
        userId: user.id,
        eventType: "chat_message",
        metadata: {
          modelId,
          conversationId: conversation.id,
          agentId,
          workspaceId,
          messageCount: messages.length,
          responseLength: response.content.length,
          cost: response.cost,
          usage: response.usage
        }
      }
    })

    return NextResponse.json({
      content: response.content,
      model: response.model,
      conversationId: conversation.id,
      usage: response.usage,
      cost: response.cost
    })

  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 })
    }

    // Get conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        workspace: {
          select: { id: true, name: true }
        },
        agent: {
          select: { id: true, name: true, description: true }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Check if user owns this conversation
    if (conversation.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(conversation)

  } catch (error) {
    console.error("Get conversation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
