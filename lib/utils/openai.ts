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

export const createPanditAI = () => {
  // Initialize the OpenAI model
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o",
    temperature: 0.7,
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