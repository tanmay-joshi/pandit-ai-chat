import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

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
    const { title = "New Consultation", agentId, kundaliId } = body;

    // Validate required fields
    if (!kundaliId) {
      return NextResponse.json(
        { error: "Kundali selection is required" },
        { status: 400 }
      );
    }

    // Verify that the kundali belongs to the user
    let kundali;
    if (kundaliId) {
      kundali = await prisma.kundali.findUnique({
        where: { id: kundaliId },
      });

      if (!kundali) {
        return NextResponse.json(
          { error: "Selected Kundali not found" },
          { status: 404 }
        );
      }

      if (kundali.userId !== user.id) {
        return NextResponse.json(
          { error: "Unauthorized to use this Kundali" },
          { status: 403 }
        );
      }
    }

    // Get agent information if an agent ID was provided
    let agent;
    if (agentId) {
      agent = await prisma.agent.findUnique({
        where: { id: agentId },
      });
    }

    // Create a more descriptive title that includes Pandit and Kundali names
    const chatTitle = agent && kundali
      ? `${agent.name} consultation for ${kundali.fullName}`
      : kundali 
        ? `Consultation for ${kundali.fullName}` 
        : title;

    // Create new chat with the selected agent and kundali
    const newChat = await prisma.chat.create({
      data: {
        title: chatTitle,
        userId: user.id,
        agentId: agentId || null,
        kundaliId: kundaliId,
      },
      include: {
        agent: true,
        kundali: true,
      },
    });

    return NextResponse.json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
} 