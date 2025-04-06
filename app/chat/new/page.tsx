import ChatPageClient from "../[id]/chatPage";

export default function NewChatPage() {
  // Directly render the ChatPageClient with "new" as the ID
  // instead of redirecting, which was causing a loop
  return <ChatPageClient id="new" />;
} 