import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../../lib/prisma";
import { authOptions } from "../../../../auth/[...nextauth]/route";

// Update a message (used to update the content and suggested questions after streaming)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const { id: chatId, messageId } = params;
    
    if (!chatId || !messageId) {
      return NextResponse.json({ error: "Chat ID and Message ID are required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the message to update
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { chat: true }
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Verify ownership
    if (message.chat.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { content, suggestedQuestions } = await req.json();

    // Convert suggestedQuestions array to JSON string if present
    const suggestedQuestionsData = suggestedQuestions 
      ? JSON.stringify(suggestedQuestions) 
      : null;

    // Update the message with complete content and suggested questions
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: content || message.content,
        suggestedQuestions: suggestedQuestionsData
      }
    });

    return NextResponse.json(updatedMessage);
    
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
} 