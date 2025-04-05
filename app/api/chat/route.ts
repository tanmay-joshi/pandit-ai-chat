import { NextResponse } from "next/server";
import { createPanditAI } from "../../../lib/utils/openai";
import { Message } from "../../../lib/types";
import { StreamingTextResponse } from "ai";

export const maxDuration = 60; // Set max duration to 60 seconds

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get the last message from the user
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }
    
    // Get the pandit AI chain (now using OpenAI)
    const panditChain = createPanditAI();
    
    // Get a streaming response from the model
    const stream = await panditChain.stream(lastMessage.content);
    
    // Return the streaming response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 