
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getConversationPartner } from "@/utils/get-conversation-participants";
import { ChatBox } from "@/components/chat/ChatBox";
import { useChatRealtime } from "@/contexts/ChatRealtimeContext";

export function DealPanel({ orderId, orderInfo, onOfferSubmit }: any) {
  const [offerPrice, setOfferPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOfferSent, setIsOfferSent] = useState(false);
  const [activeTab, setActiveTab] = useState("negotiate");
  const [conversationPartner, setConversationPartner] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setActiveOrderId } = useChatRealtime();
  
  const handleSubmitOffer = async () => {
    if (!user || !orderId) return;
    
    setIsLoading(true);
    
    try {
      const price = parseFloat(offerPrice);
      if (isNaN(price) || price <= 0) {
        alert("Please enter a valid price.");
        return;
      }
      
      // Simulate sending an offer
      console.log("Offer submitted:", { orderId, price, userId: user.id });
      
      // Call the callback function to handle offer submission
      onOfferSubmit({ orderId, price, userId: user.id });
      
      setIsOfferSent(true);
    } catch (error) {
      console.error("Error submitting offer:", error);
      alert("Failed to submit offer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get conversation partner for chat
  useEffect(() => {
    if (!user || !orderId) return;

    const getPartner = async () => {
      const partnerId = await getConversationPartner(orderId, user.id);
      setConversationPartner(partnerId);
    };

    getPartner();
  }, [orderId, user]);

  // Update active order ID when chat tab is active
  useEffect(() => {
    if (activeTab === "message" && orderId) {
      setActiveOrderId(orderId);
    } else {
      setActiveOrderId(null);
    }
  }, [activeTab, orderId, setActiveOrderId]);

  const handleViewFullChat = () => {
    navigate(`/inbox/${orderId}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Deal Zone</CardTitle>
        <CardDescription>
          Verhandle und schließe den Transport ab
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="negotiate" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="negotiate">Angebot & Verhandlung</TabsTrigger>
            <TabsTrigger value="message">
              Nachrichten
              <MessageCircle className="ml-2 h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="negotiate" className="mt-4">
            {!isOfferSent ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Dein Angebot (EUR)</Label>
                  <Input
                    type="number"
                    id="price"
                    placeholder="Gib deinen Preis ein"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                  />
                </div>
                <Button onClick={handleSubmitOffer} disabled={isLoading}>
                  {isLoading ? "Sende Angebot..." : "Angebot senden"}
                  <ArrowRight className="ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-green-500 font-semibold">
                Angebot gesendet! Warte auf die Bestätigung.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="message" className="mt-4">
            <div className="h-[400px] flex flex-col">
              {conversationPartner ? (
                <>
                  <div className="flex-grow overflow-hidden">
                    <ChatBox 
                      orderId={orderId} 
                      recipientId={conversationPartner}
                      orderDescription={orderInfo?.description}
                    />
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleViewFullChat}
                    >
                      Vollständigen Chat ansehen
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Noch keine Konversation</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Sobald der Deal zustande kommt, kannst du hier mit dem Partner chatten
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
