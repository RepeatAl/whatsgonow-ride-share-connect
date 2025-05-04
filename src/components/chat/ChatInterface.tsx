
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
  Check,
  X,
  Clock,
  Truck,
  CheckCircle2,
  Info,
  BadgeDollarSign
} from "lucide-react";
import { TransportRequest } from "@/data/mockData";
import ChatMessage from "@/features/chat/components/ChatMessage";
import { TrackingStatus } from "@/pages/Tracking";
import { PaymentStatus } from "@/types/payment";

export type MessageType = "message" | "offer" | "counter_offer" | "accept" | "reject" | "status" | "payment";

export interface ChatMessage {
  id: string;
  sender: "user" | "driver" | "system";
  type: MessageType;
  content: string;
  timestamp: Date;
  price?: number;
  status?: TrackingStatus;
  paymentStatus?: PaymentStatus;
}

interface ChatInterfaceProps {
  orderId: string;
  order: TransportRequest & { userName?: string };
  currentStatus?: TrackingStatus;
}

const ChatInterface = ({ orderId, order, currentStatus = "pickup" }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [offerPending, setOfferPending] = useState(false);
  const [orderStatus, setOrderStatus] = useState<TrackingStatus>(currentStatus);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const previousPaymentStatus = useRef<PaymentStatus | undefined>(order.paymentStatus);

  useEffect(() => {
    if (currentStatus !== orderStatus) {
      setOrderStatus(currentStatus);
    }
  }, [currentStatus, orderStatus]);

  useEffect(() => {
    if (orderStatus && isConnected) {
      const statusMap = {
        pickup: "Der Fahrer hat die Ware abgeholt.",
        transit: "Der Fahrer ist jetzt unterwegs zum Lieferort.",
        delivered: "Die Lieferung wurde erfolgreich zugestellt."
      };
      
      const statusMessage: ChatMessage = {
        id: `status-${Date.now()}`,
        sender: "system",
        type: "status",
        content: statusMap[orderStatus],
        timestamp: new Date(),
        status: orderStatus
      };
      
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (!lastMsg || lastMsg.type !== "status" || lastMsg.status !== orderStatus) {
          return [...prev, statusMessage];
        }
        return prev;
      });
    }
  }, [orderStatus, isConnected]);

  useEffect(() => {
    if (isConnected && order.paymentStatus && order.paymentStatus !== previousPaymentStatus.current) {
      let content = "";
      
      if (order.paymentStatus === "reserved") {
        content = "Die Zahlung wurde vorgemerkt. Der Betrag wird nach erfolgreicher Lieferung freigegeben.";
      } else if (order.paymentStatus === "paid") {
        content = "Die Zahlung wurde abgeschlossen. Vielen Dank für Ihren Auftrag!";
      } else if (order.paymentStatus === "cancelled") {
        content = "Die Zahlungsreservierung wurde storniert.";
      }
      
      if (content) {
        const paymentMessage: ChatMessage = {
          id: `payment-${Date.now()}`,
          sender: "system",
          type: "payment",
          content,
          timestamp: new Date(),
          paymentStatus: order.paymentStatus
        };
        
        setMessages(prev => [...prev, paymentMessage]);
      }
      
      previousPaymentStatus.current = order.paymentStatus;
    }
  }, [order.paymentStatus, isConnected]);

  useEffect(() => {
    console.log("Connecting to WebSocket for order:", orderId);
    
    const connectionTimeout = setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Verbunden",
        description: "Chat-Verbindung hergestellt.",
      });
      
      setMessages([
        {
          id: "system-1",
          sender: "user",
          type: "message",
          content: "Ich habe Interesse an Ihrem Transport. Lassen Sie uns über den Preis sprechen.",
          timestamp: new Date(Date.now() - 60000)
        }
      ]);
      
      setTimeout(() => {
        setIsTyping(true);
        
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
    
    return () => {
      clearTimeout(connectionTimeout);
      console.log("Disconnecting WebSocket");
    };
  }, [orderId, toast]);

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

    setTimeout(() => {
      setMessages(prev => [...prev, newMessage]);
      setInputMessage("");
      setInputPrice("");
      setShowPriceInput(false);
      setIsSending(false);
      
      if (messageType === "counter_offer") {
        simulateResponse();
      }
    }, 500);
  };

  const simulateResponse = () => {
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const randomResponse = Math.random() > 0.5;
        
        if (randomResponse) {
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

  const getStatusIcon = (status: TrackingStatus) => {
    switch(status) {
      case "pickup": return <Clock className="h-4 w-4 text-blue-500" />;
      case "transit": return <Truck className="h-4 w-4 text-yellow-500" />;
      case "delivered": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getPaymentStatusIcon = (status: PaymentStatus) => {
    switch(status) {
      case "reserved": return <BadgeDollarSign className="h-4 w-4 text-blue-500" />;
      case "paid": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "cancelled": return <X className="h-4 w-4 text-red-500" />;
      default: return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  const transformChatMessage = (message: ChatMessage) => {
    return {
      id: message.id,
      content: message.content,
      timestamp: message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: message.sender === 'driver',
      sender: message.sender === 'driver' ? 'You' : message.sender === 'user' ? order.userName || 'User' : 'System',
      read: true
    };
  };

  const getMessageStatusClass = (message: ChatMessage) => {
    if (message.type === "status") {
      switch(message.status) {
        case "pickup": return "bg-blue-50 border-blue-200";
        case "transit": return "bg-yellow-50 border-yellow-200";
        case "delivered": return "bg-green-50 border-green-200";
        default: return "bg-gray-50 border-gray-200";
      }
    } else if (message.type === "payment") {
      switch(message.paymentStatus) {
        case "reserved": return "bg-blue-50 border-blue-200";
        case "paid": return "bg-green-50 border-green-200";
        case "cancelled": return "bg-red-50 border-red-200";
        default: return "bg-gray-50 border-gray-200";
      }
    }
    
    return "bg-gray-50 border-gray-200";
  };

  const getStatusDisplayText = (status: TrackingStatus) => {
    switch(status) {
      case "pickup": return "Abholung läuft";
      case "transit": return "Unterwegs zum Ziel";
      case "delivered": return "Lieferung abgeschlossen";
      default: return "Status unbekannt";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      <div className="p-3 border-b">
        <h2 className="font-semibold">Preisverhandlung</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-500">
              {isConnected ? 'Verbunden' : 'Verbindung wird hergestellt...'}
            </span>
          </div>
          {orderStatus && isConnected && (
            <div className="flex items-center text-sm ml-4 px-2 py-1 rounded-full bg-blue-50">
              {getStatusIcon(orderStatus)}
              <span className="ml-1 font-medium text-blue-700">
                {getStatusDisplayText(orderStatus)}
              </span>
            </div>
          )}
          {order.paymentStatus && order.paymentStatus !== "pending" && (
            <div className={`flex items-center text-sm ml-2 px-2 py-1 rounded-full ${
              order.paymentStatus === "reserved" ? "bg-blue-50 text-blue-700" :
              order.paymentStatus === "paid" ? "bg-green-50 text-green-700" :
              "bg-red-50 text-red-700"
            }`}>
              {getPaymentStatusIcon(order.paymentStatus)}
              <span className="ml-1 font-medium">
                {order.paymentStatus === "reserved" ? "Zahlung vorgemerkt" :
                 order.paymentStatus === "paid" ? "Zahlung abgeschlossen" :
                 "Zahlung storniert"}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-grow px-4 py-2">
        <div className="space-y-4">
          {messages.map((message) => {
            if (message.type === "status" || message.type === "payment") {
              return (
                <div key={message.id} className={`p-2 border rounded-md text-sm ${getMessageStatusClass(message)}`}>
                  <div className="flex items-center justify-center gap-2">
                    {message.type === "status" && message.status && getStatusIcon(message.status)}
                    {message.type === "payment" && message.paymentStatus && getPaymentStatusIcon(message.paymentStatus)}
                    <span>{message.content}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            }
            return <ChatMessage 
              key={message.id} 
              message={transformChatMessage(message)} 
            />;
          })}
          
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
