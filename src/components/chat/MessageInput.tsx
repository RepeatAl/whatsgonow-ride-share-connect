
import React, { useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export const MessageInput = ({ 
  message, 
  setMessage, 
  onSendMessage,
  isLoading
}: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex w-full items-end gap-2">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nachricht schreiben..."
        className="flex-grow resize-none min-h-[60px]"
      />
      <Button 
        onClick={onSendMessage} 
        disabled={!message.trim() || isLoading}
        className="flex-shrink-0"
        size="icon"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};
