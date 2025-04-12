
import { Check, DollarSign, MessageSquare, ThumbsUp, ThumbsDown, Info } from "lucide-react";
import { ChatMessage as ChatMessageType } from "./ChatInterface";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUserMessage = message.sender === "user";
  const getMessageTypeIcon = () => {
    switch (message.type) {
      case "offer":
      case "counter_offer":
        return <DollarSign className="h-4 w-4" />;
      case "accept":
        return <ThumbsUp className="h-4 w-4" />;
      case "reject":
        return <ThumbsDown className="h-4 w-4" />;
      case "status":
        return <Info className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getMessageTypeBg = () => {
    switch (message.type) {
      case "offer":
      case "counter_offer":
        return isUserMessage ? "bg-blue-100" : "bg-brand-primary";
      case "accept":
        return isUserMessage ? "bg-green-100" : "bg-green-600";
      case "reject":
        return isUserMessage ? "bg-red-100" : "bg-red-600";
      case "status":
        return "bg-blue-50";
      default:
        return isUserMessage ? "bg-blue-100" : "bg-brand-primary";
    }
  };

  const getMessageTypeTextColor = () => {
    if (message.type === "status") {
      return "text-blue-700";
    }
    
    if (isUserMessage) {
      return "text-gray-800";
    }
    
    switch (message.type) {
      case "offer":
      case "counter_offer":
      case "accept":
      case "reject":
        return "text-white";
      default:
        return "text-white";
    }
  };

  return (
    <div className={cn(
      "flex",
      isUserMessage ? "justify-start" : "justify-end",
      message.type === "status" && "justify-center"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-3 shadow-sm",
        getMessageTypeBg(),
        getMessageTypeTextColor(),
        message.type === "status" && "border border-blue-200 w-full text-center"
      )}>
        {(message.type === "offer" || message.type === "counter_offer") && message.price && (
          <div className="font-bold mb-1 flex items-center">
            <DollarSign className={cn(
              "h-4 w-4 mr-1",
              isUserMessage ? "text-blue-500" : "text-white"
            )} />
            €{message.price.toFixed(2)}
          </div>
        )}
        
        <div className="flex gap-1 items-start">
          {message.type === "status" && (
            <Info className="h-4 w-4 mr-1 text-blue-500" />
          )}
          <div className="flex-grow">{message.content}</div>
        </div>
        
        <div className="text-xs mt-1 opacity-70 flex items-center justify-end gap-1">
          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          {message.type === "accept" && (
            <Check className="h-3 w-3 ml-1" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
