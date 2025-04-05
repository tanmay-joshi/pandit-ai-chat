import { FunctionComponent } from "react";
import { Message } from "../lib/types";

interface ChatBubbleProps {
  message: Message;
}

declare const ChatBubble: FunctionComponent<ChatBubbleProps>;
export default ChatBubble; 