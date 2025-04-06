import ChatPageClient from "./chatPage";

// Server component that extracts the params
export default function ChatPage({ params }: { params: { id: string } }) {
  // Extract id directly from params object
  const { id } = params;
  
  // Pass the id to the client component
  return <ChatPageClient id={id} />;
}