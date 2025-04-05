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

// The Pandit AI system prompt that guides OpenAI to respond like a Hindu spiritual guide
const PANDIT_SYSTEM_PROMPT = `You are Pandit AI, a knowledgeable Hindu spiritual guide with deep expertise in Hindu scriptures, philosophy, and traditions.

Your purpose is to provide accurate, thoughtful guidance on Hindu practices, philosophy, scriptures like the Vedas, Upanishads, Bhagavad Gita, Puranas, and other sacred texts.

Please assist users with:
- Understanding Hindu philosophy (Vedanta, Samkhya, Yoga, etc.)
- Interpreting scriptures and sacred texts
- Explaining rituals, customs, and festivals
- Providing spiritual guidance based on Hindu principles
- Answering questions about deities, mantras, and worship practices
- Sharing wisdom from ancient Hindu traditions

When responding:
- Be respectful, compassionate, and non-judgmental
- Provide context and nuance when discussing complex topics
- Acknowledge diverse perspectives within Hinduism
- Cite specific scriptures or texts when relevant
- Use Sanskrit terms where appropriate, with translations
- Avoid being prescriptive about personal life choices
- Maintain the spiritual essence of Hindu traditions

If you don't know something, acknowledge your limitations rather than providing incorrect information.`;

// Create the Pandit AI chain
const createPanditAI = () => {
  // Initialize the OpenAI model with streaming
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.7,
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Create a prompt template for Pandit AI
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", PANDIT_SYSTEM_PROMPT],
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
  { params }: { params: { id: string } }
) {
  try {
    // Directly await params.id
    const chatId = await params.id;
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

    // Use explicit Prisma client querying to avoid type issues
    const chats = await prisma.$queryRaw`
      SELECT * FROM "Chat" WHERE id = ${chatId}
    ` as Array<any>;
    
    const chat = chats[0];

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

    // Save user message to database with raw query
    const userMessageResults = await prisma.$queryRaw`
      INSERT INTO "Message" (id, content, role, "chatId", "userId", "createdAt")
      VALUES (${crypto.randomUUID()}, ${content}, 'user', ${chatId}, ${user.id}, ${new Date().toISOString()})
      RETURNING *
    ` as Array<any>;
    
    const userMessage = userMessageResults[0];

    // Initialize the Pandit AI chain
    const panditAI = createPanditAI();

    // Create a placeholder AI message in the database
    let aiMessageId = crypto.randomUUID();
    await prisma.$queryRaw`
      INSERT INTO "Message" (id, content, role, "chatId", "userId", "createdAt")
      VALUES (${aiMessageId}, '', 'assistant', ${chatId}, ${user.id}, ${new Date().toISOString()})
    `;

    try {
      console.log("Starting AI stream for message:", aiMessageId);
      
      // Get a streaming response from the model
      const stream = await panditAI.stream(content);
      
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
                  await prisma.$queryRaw`
                    UPDATE "Message" 
                    SET content = ${fullResponse}
                    WHERE id = ${aiMessageId}
                  `;
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
      responseHeaders.set('X-Message-Id', aiMessageId);
      
      // Return the streaming response
      return new StreamingTextResponse(streamForResponse, { 
        headers: responseHeaders
      });
    } catch (error) {
      console.error("AI processing error:", error);
      
      // Clean up the AI message on error
      try {
        await prisma.$queryRaw`
          DELETE FROM "Message" 
          WHERE id = ${aiMessageId}
        `;
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