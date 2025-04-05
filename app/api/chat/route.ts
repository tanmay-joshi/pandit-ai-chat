import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // This is a placeholder response
    // Here you would integrate with your AI provider
    
    return NextResponse.json({
      id: Date.now().toString(),
      role: "assistant",
      content: "I am Pandit AI, your spiritual companion. How can I assist you today?",
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 