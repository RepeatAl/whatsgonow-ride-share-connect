
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  DollarSign, 
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Check,
  X
} from "lucide-react";
import { TransportRequest } from "@/data/mockData";
import ChatMessage from "./ChatMessage";

// Define chat message types
export type MessageType = "message" | "offer" | "counter_offer" | "accept" | "reject";

export interface ChatMessage {
  id: string;
  sender: "user" | "driver";
  type: MessageType;
  content: string;
  timestamp: Date;
  price?: number;
}

interface ChatInterfaceProps {
  orderId: string;
  order: TransportRequest;
}

const ChatInterface = ({ orderId, order }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [offerPending, setOfferPending] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Simulate WebSocket connection
  useEffect(() => {
    // In a real implementation, this would connect to the WebSocket server
    console.log("Connecting to WebSocket for order:", orderId);
    
    // Simulate connection setup
    const connectionTimeout = setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Verbunden",
        description: "Chat-Verbindung hergestellt.",
      });
      
      // Add initial system message
      setMessages([
        {
          id: "system-1",
          sender: "user",
          type: "message",
          content: "Ich habe Interesse an Ihrem Transport. Lassen Sie uns über den Preis sprechen.",
          timestamp: new Date(Date.now() - 60000)
        }
      ]);
      
      // Simulate "user is typing" after a delay
      setTimeout(() => {
        setIsTyping(true);
        
        // Then simulate receiving a counter offer
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            {
              id: "counter-1",
              sender: "user",
              type: "counter_offer",
              content: "Ich kann €45 anbieten. Das ist mein Budget.",
              timestamp: new Date(),
              price: 45
            }
          ]);
          setOfferPending(true);
        }, 3000);
      }, 2000);
    }, 1500);
    
    // Cleanup function
    return () => {
      clearTimeout(connectionTimeout);
      console.log("Disconnecting WebSocket");
    };
  }, [orderId, toast]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if ((!inputMessage.trim() && !inputPrice) || isSending) {
      return;
    }

    setIsSending(true);

    const messageType: MessageType = showPriceInput && inputPrice ? "counter_offer" : "message";
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "driver",
      type: messageType,
      content: inputMessage.trim() || (showPriceInput ? "Hier ist mein Preisvorschlag:" : ""),
      timestamp: new Date(),
      ...(showPriceInput && inputPrice ? { price: parseFloat(inputPrice) } : {})
    };

    // Simulate sending to WebSocket
    setTimeout(() => {
      setMessages(prev => [...prev, newMessage]);
      setInputMessage("");
      setInputPrice("");
      setShowPriceInput(false);
      setIsSending(false);
      
      // If this was a counter offer, simulate response
      if (messageType === "counter_offer") {
        simulateResponse();
      }
    }, 500);
  };

  const simulateResponse = () => {
    // Simulate user typing after receiving counter offer
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const randomResponse = Math.random() > 0.5;
        
        if (randomResponse) {
          // Accept offer
          setMessages(prev => [
            ...prev,
            {
              id: `response-${Date.now()}`,
              sender: "user",
              type: "accept",
              content: "Angebot akzeptiert! Ich freue mich auf die Zusammenarbeit.",
              timestamp: new Date()
            }
          ]);
          setOfferPending(false);
          
          toast({
            title: "Angebot akzeptiert!",
            description: "Der Auftraggeber hat Ihr Angebot angenommen."
          });
        } else {
          // Counter offer or message
          setMessages(prev => [
            ...prev,
            {
              id: `response-${Date.now()}`,
              sender: "user",
              type: "message",
              content: "Danke für Ihr Angebot. Ich überlege es mir.",
              timestamp: new Date()
            }
          ]);
        }
      }, 2500);
    }, 1500);
  };

  const handleAccept = () => {
    setMessages(prev => [
      ...prev,
      {
        id: `accept-${Date.now()}`,
        sender: "driver",
        type: "accept",
        content: "Ich akzeptiere den Preis von €45.",
        timestamp: new Date()
      }
    ]);
    
    setOfferPending(false);
    
    toast({
      title: "Angebot akzeptiert",
      description: "Sie haben das Angebot akzeptiert. Bereiten Sie sich auf den Transport vor."
    });
  };

  const handleReject = () => {
    setMessages(prev => [
      ...prev,
      {
        id: `reject-${Date.now()}`,
        sender: "driver",
        type: "reject",
        content: "Leider kann ich diesen Preis nicht akzeptieren.",
        timestamp: new Date()
      }
    ]);
    
    setOfferPending(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      <div className="p-3 border-b">
        <h2 className="font-semibold">Preisverhandlung</h2>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-500">
            {isConnected ? 'Verbunden' : 'Verbindung wird hergestellt...'}
          </span>
        </div>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-grow px-4 py-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500 text-sm ml-2">
              <div className="flex gap-1">
                <span className="animate-pulse">•</span>
                <span className="animate-pulse delay-75">•</span>
                <span className="animate-pulse delay-150">•</span>
              </div>
              Gegenseite schreibt...
            </div>
          )}
          
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      
      {offerPending && (
        <div className="p-3 border-t bg-yellow-50">
          <div className="mb-2 text-sm font-medium">Offenes Angebot (€45)</div>
          <div className="flex gap-2">
            <Button 
              onClick={handleAccept} 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-1 h-4 w-4" /> Akzeptieren
            </Button>
            <Button 
              onClick={handleReject} 
              size="sm" 
              variant="outline"
            >
              <X className="mr-1 h-4 w-4" /> Ablehnen
            </Button>
          </div>
        </div>
      )}
      
      <div className="p-3 border-t">
        <div className="flex gap-2 mb-2">
          <Button 
            type="button" 
            size="sm" 
            variant={showPriceInput ? "default" : "outline"}
            onClick={() => setShowPriceInput(!showPriceInput)}
            className={showPriceInput ? "bg-brand-primary hover:bg-brand-primary/90" : ""}
          >
            <DollarSign className="h-4 w-4" />
            Preisangebot
          </Button>
        </div>
        
        {showPriceInput && (
          <div className="mb-3 flex items-center">
            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
            <Input
              type="number"
              placeholder="Preis in €"
              value={inputPrice}
              onChange={(e) => setInputPrice(e.target.value)}
              className="w-24"
              min="1"
              step="0.5"
            />
            <span className="ml-2 text-sm text-gray-500">€</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Nachricht eingeben..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={isSending || (!inputMessage.trim() && !inputPrice)}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
