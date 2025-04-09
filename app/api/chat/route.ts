import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

type Kundali = {
  id: string;
  fullName: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  systemPrompt: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  messageCost: number;
  tags: string | null;
  kundaliLimit: number;
};

// Get all chats for the current user
export async function GET(req: NextRequest) {
  try {
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

    const chats = await prisma.chat.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { agent: true },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

// Create a new chat
export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();
    const { title = "New Consultation", agentId, kundaliIds } = body;

    // Validate required fields
    if (!kundaliIds || !Array.isArray(kundaliIds) || kundaliIds.length === 0) {
      return NextResponse.json(
        { error: "At least one Kundali selection is required" },
        { status: 400 }
      );
    }

    // Verify that selected agent exists and get kundali limit
    let agent;
    let kundaliLimit = 1;
    if (agentId) {
      agent = await prisma.agent.findUnique({
        where: { id: agentId },
      });
      
      if (agent) {
        // Check if kundaliLimit exists on agent
        kundaliLimit = 'kundaliLimit' in agent ? (agent as any).kundaliLimit : 1;
      }
    }
    
    // Check if number of selected kundalis exceeds agent's limit
    if (kundaliIds.length > kundaliLimit) {
      return NextResponse.json(
        { error: `This agent can only analyze up to ${kundaliLimit} kundalis` },
        { status: 400 }
      );
    }

    // Verify that all kundalis belong to the user
    for (const kundaliId of kundaliIds) {
      const kundali = await prisma.kundali.findUnique({
        where: { id: kundaliId },
      });

      if (!kundali) {
        return NextResponse.json(
          { error: `Kundali with ID ${kundaliId} not found` },
          { status: 404 }
        );
      }

      if (kundali.userId !== user.id) {
        return NextResponse.json(
          { error: "Unauthorized to use one or more selected Kundalis" },
          { status: 403 }
        );
      }
    }

    // Get kundali names for title creation
    const kundalis = await prisma.kundali.findMany({
      where: {
        id: { in: kundaliIds }
      }
    });

    // Create a more descriptive title that includes Pandit and Kundali names
    let chatTitle = title;
    if (agent && kundalis.length > 0) {
      if (kundalis.length === 1) {
        chatTitle = `${agent.name} consultation for ${kundalis[0].fullName}`;
      } else {
        chatTitle = `${agent.name} consultation (multiple charts)`;
      }
    } else if (kundalis.length === 1) {
      chatTitle = `Consultation for ${kundalis[0].fullName}`;
    } else if (kundalis.length > 1) {
      chatTitle = "Consultation with multiple charts";
    }

    // Create new chat
    const newChat = await prisma.chat.create({
      data: {
        title: chatTitle,
        userId: user.id,
        agentId: agentId || null,
      },
      include: {
        agent: true,
      },
    });
    
    // Create kundali relations
    for (const kundaliId of kundaliIds) {
      await prisma.$executeRaw`
        INSERT INTO "ChatKundali" (id, chatId, kundaliId, createdAt)
        VALUES (${crypto.randomUUID()}, ${newChat.id}, ${kundaliId}, ${new Date()})
      `;
    }
    
    // Retrieve all kundalis for this chat
    const chatKundalis = await prisma.kundali.findMany({
      where: {
        id: { in: kundaliIds }
      }
    });
    
    // Return the chat with agent and kundalis
    return NextResponse.json({
      ...newChat,
      kundalis: chatKundalis
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
} 