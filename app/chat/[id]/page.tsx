import ChatPageClient from "./chatPage";

// Server component that extracts the params
export default async function ChatPage({ params }: { params: any }) {
  // Await params to get id
  const { id } = await params;
  
  // Pass the id to the client component
  return <ChatPageClient id={id} />;
}