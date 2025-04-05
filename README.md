# Pandit AI Chat

A modern Next.js application featuring an AI chatbot that serves as a Hindu spiritual guide, powered by OpenAI and LangChain.

## Features

- **AI Spiritual Guide**: Leverages GPT-4o to provide thoughtful guidance on Hindu practices, philosophy, scriptures, and traditions
- **Real-time Streaming**: Implements streaming responses for a natural conversation experience
- **Modern UI**: Built with Next.js, Tailwind CSS, and shadcn/ui for a clean, responsive interface
- **LangChain Integration**: Uses LangChain for seamless AI interactions and prompt management

## Technologies

- [Next.js](https://nextjs.org/) - React framework
- [OpenAI](https://openai.com/) - GPT-4o language model
- [LangChain](https://js.langchain.com/) - Framework for LLM application development
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tanmay-joshi/pandit-ai-chat.git
   cd pandit-ai-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional: LangSmith for tracing (development only)
   LANGSMITH_TRACING=true
   LANGSMITH_API_KEY=your_langsmith_api_key_here
   LANGSMITH_PROJECT=pandit-ai
   
   # For development only
   LANGCHAIN_CALLBACKS_BACKGROUND=false
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

Simply type your questions about Hindu philosophy, scriptures, rituals, or spiritual practices in the chat interface, and Pandit AI will provide thoughtful, respectful guidance.

## Deployment

The application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftanmay-joshi%2Fpandit-ai-chat)

## License

MIT License

## Acknowledgements

- Inspired by [LangChain Next.js Template](https://github.com/langchain-ai/langchain-nextjs-template)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
