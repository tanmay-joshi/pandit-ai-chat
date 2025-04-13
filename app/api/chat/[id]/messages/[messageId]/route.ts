import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../../lib/prisma";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { logger } from "../../../../../../lib/logger";

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

    // Update the message content
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content: content || message.content }
    });

    // Update the chat with suggested questions
    if (suggestedQuestionsData) {
      await prisma.$executeRaw`UPDATE "Chat" SET "suggestedQuestions" = ${suggestedQuestionsData} WHERE id = ${chatId}`;
    }

    // Get the updated chat data
    const chatData = await prisma.$queryRaw`
      SELECT "suggestedQuestions" FROM "Chat" WHERE id = ${chatId}
    `;

    // Safely access the result
    const chatSuggestedQuestions = Array.isArray(chatData) && chatData.length > 0 
      ? chatData[0].suggestedQuestions 
      : null;

    return NextResponse.json({
      message: updatedMessage,
      chatSuggestedQuestions
    });
    
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const { id: chatId, messageId } = params;
    
    logger.debug(`GET message ${messageId} from chat ${chatId}`);
    
    if (!chatId || !messageId) {
      return NextResponse.json({ error: "Chat ID and Message ID are required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the chat with suggested questions
    const chat = await prisma.$queryRaw`
      SELECT id, "userId", "suggestedQuestions" 
      FROM "Chat" 
      WHERE id = ${chatId}
    `;

    if (!chat || !Array.isArray(chat) || chat.length === 0) {
      logger.error(`Chat ${chatId} not found`);
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const chatData = chat[0];
    logger.debug(`Chat data for ${chatId}:`, chatData);

    if (chatData.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get the specific message
    const message = await prisma.message.findUnique({
      where: { 
        id: messageId,
        chatId: chatId
      }
    });

    if (!message) {
      logger.error(`Message ${messageId} not found`);
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    logger.debug(`Message ${messageId} found:`, message);
    logger.debug(`Chat ${chatId} suggested questions:`, chatData.suggestedQuestions);

    // Create response and set headers
    const response = NextResponse.json({
      message,
      chatSuggestedQuestions: chatData.suggestedQuestions
    }, { status: 200 });
    
    // Set headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Content-Type', 'application/json');
    
    return response;
  } catch (error) {
    logger.error("Error fetching message:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
} 