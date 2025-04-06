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

// Cost per message in credits
const MESSAGE_COST = 10;

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
      include: { wallet: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has a wallet and sufficient balance
    if (!user.wallet) {
      // Create a wallet with initial credits if user doesn't have one
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 100, // Start with 100 free credits
          transactions: {
            create: {
              amount: 100,
              type: "welcome_bonus",
              description: "Welcome bonus"
            }
          }
        }
      });
      
      // Refetch user with the new wallet
      const updatedUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { wallet: true }
      });
      
      if (!updatedUser || !updatedUser.wallet) {
        return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 });
      }
      
      user.wallet = updatedUser.wallet;
    }
    
    // Check if user has enough credits for a message (only AI response now)
    if (user.wallet.balance < MESSAGE_COST) {
      return NextResponse.json({ 
        error: "Insufficient credits", 
        balance: user.wallet.balance,
        required: MESSAGE_COST
      }, { status: 402 }); // 402 Payment Required
    }

    // Get the chat along with its agent if one is associated
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { 
        agent: true,
        kundali: true 
      }
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

    // No longer deducting credits for user messages
    // Save user message to database
    const userMessage = await prisma.message.create({
      data: {
        content,
        role: "user",
        chatId,
        userId: user.id,
        cost: 0,  // User messages are free
        paid: true
      }
    });

    // Determine which system prompt to use
    let systemPrompt = DEFAULT_SYSTEM_PROMPT;
    if (chat.agent && chat.agent.systemPrompt) {
      systemPrompt = chat.agent.systemPrompt;
      console.log(`Using agent ${chat.agent.name} with custom system prompt`);
    }

    // If kundali is present, add it to the system prompt
    if (chat.kundali) {
      const kundaliInfo = `
KUNDALI INFORMATION:
Full Name: ${chat.kundali.fullName}
Date of Birth: ${new Date(chat.kundali.dateOfBirth).toLocaleString()}
Place of Birth: ${chat.kundali.placeOfBirth}

Use this Kundali information to provide more personalized and relevant astrological guidance. 
Make references to this information when appropriate in your responses.
`;
      
      systemPrompt = `${systemPrompt}\n\n${kundaliInfo}`;
    }

    // Initialize the AI chain with the appropriate system prompt
    const aiChain = createAIChain(systemPrompt);

    // Deduct credits for AI message
    await prisma.wallet.update({
      where: { id: user.wallet.id },
      data: {
        balance: { decrement: MESSAGE_COST },
        transactions: {
          create: {
            amount: -MESSAGE_COST,
            type: "message_fee",
            description: "AI response fee"
          }
        }
      }
    });

    // Create a placeholder AI message in the database
    const aiMessage = await prisma.message.create({
      data: {
        content: "",
        role: "assistant",
        chatId,
        userId: user.id,
        cost: MESSAGE_COST,
        paid: true
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
      
      // Refund the AI message fee if there's an error
      await prisma.wallet.update({
        where: { id: user.wallet.id },
        data: {
          balance: { increment: MESSAGE_COST },
          transactions: {
            create: {
              amount: MESSAGE_COST,
              type: "refund",
              description: "Refund for failed AI response"
            }
          }
        }
      });
      
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