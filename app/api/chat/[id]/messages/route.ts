import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { StreamingTextResponse } from "ai";
import { prisma } from "../../../../../lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { 
  RunnableSequence, 
  RunnablePassthrough 
} from "@langchain/core/runnables";

// The default system prompt if no agent is specified
const DEFAULT_SYSTEM_PROMPT = `You are a helpful, knowledgeable, and friendly AI assistant. Answer user questions accurately and provide useful information.`;

// Create the AI chain with the specified system prompt
const createAIChain = (systemPrompt: string) => {
  // Initialize the OpenAI model with streaming
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.7,
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Create a prompt template with the provided system prompt
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "{input}"],
  ]);

  // Create a chain that will take a question, format it with the prompt, and pass it to the model
  const chain = RunnableSequence.from([
    {
      input: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  return chain;
};

export async function POST(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    // Await params to get id
    const { id: chatId } = await params;
    
    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
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

    // Get the chat along with its agent if one is associated
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { agent: true }
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { content } = await req.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Save user message to database
    const userMessage = await prisma.message.create({
      data: {
        content,
        role: "user",
        chatId,
        userId: user.id,
      }
    });

    // Determine which system prompt to use
    let systemPrompt = DEFAULT_SYSTEM_PROMPT;
    if (chat.agent && chat.agent.systemPrompt) {
      systemPrompt = chat.agent.systemPrompt;
      console.log(`Using agent ${chat.agent.name} with custom system prompt`);
    }

    // Initialize the AI chain with the appropriate system prompt
    const aiChain = createAIChain(systemPrompt);

    // Create a placeholder AI message in the database
    const aiMessage = await prisma.message.create({
      data: {
        content: "",
        role: "assistant",
        chatId,
        userId: user.id,
      }
    });

    try {
      console.log("Starting AI stream for message:", aiMessage.id);
      
      // Get a streaming response from the model
      const stream = await aiChain.stream(content);
      
      // Set up a background process to collect the full text and update the database
      let fullResponse = "";
      
      // This observer will collect chunks for the database update
      const processStream = async () => {
        try {
          // Create a new TextDecoder
          const textDecoder = new TextDecoder();
          
          // Create a TransformStream to duplicate the stream
          const transformStream = new TransformStream({
            transform(chunk, controller) {
              // Pass the chunk through
              controller.enqueue(chunk);
              
              // Collect the chunk for our database update
              const decoded = textDecoder.decode(chunk, { stream: true });
              fullResponse += decoded;
            },
            flush(controller) {
              // When the stream is done, update the database
              (async () => {
                try {
                  console.log("AI stream complete, updating database with response of length:", fullResponse.length);
                  await prisma.message.update({
                    where: { id: aiMessage.id },
                    data: { content: fullResponse }
                  });
                  console.log("Database updated with full response");
                } catch (error) {
                  console.error("Error updating database:", error);
                }
              })();
            }
          });
          
          // Convert the LangChain stream to a ReadableStream that the TransformStream expects
          const readableStream = new ReadableStream({
            async start(controller) {
              for await (const chunk of stream) {
                const text = chunk.toString();
                controller.enqueue(new TextEncoder().encode(text));
              }
              controller.close();
            }
          });
          
          // Return the transformed stream
          return readableStream.pipeThrough(transformStream);
        } catch (error) {
          console.error("Error processing stream:", error);
          throw error;
        }
      };
      
      // Get the processed stream
      const streamForResponse = await processStream();
      
      // Set headers for the response
      const responseHeaders = new Headers();
      responseHeaders.set('X-Message-Id', aiMessage.id);
      
      // Return the streaming response
      return new StreamingTextResponse(streamForResponse, { 
        headers: responseHeaders
      });
    } catch (error) {
      console.error("AI processing error:", error);
      
      // Clean up the AI message on error
      try {
        await prisma.message.delete({
          where: { id: aiMessage.id }
        });
        console.log("AI message cleaned up after error");
      } catch (deleteError) {
        console.error("Error deleting AI message:", deleteError);
      }
      
      return NextResponse.json(
        { error: "Failed to process AI response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
} 