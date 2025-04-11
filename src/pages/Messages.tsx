
import Layout from "@/components/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, Package, Car } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  relatedItemType: "transport" | "request";
  relatedItemTitle: string;
}

const mockConversations: Conversation[] = [
  {
    id: "c1",
    userId: "u1",
    userName: "Max Müller",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Can you pick it up at 3pm instead?",
    lastMessageTimestamp: "2025-04-11T10:23:00",
    unreadCount: 2,
    relatedItemType: "transport",
    relatedItemTitle: "Berlin to Munich"
  },
  {
    id: "c2",
    userId: "u2",
    userName: "Lisa Schmidt",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "I'll make sure to handle it carefully.",
    lastMessageTimestamp: "2025-04-10T16:05:00",
    unreadCount: 0,
    relatedItemType: "request",
    relatedItemTitle: "Guitar transport"
  },
  {
    id: "c3",
    userId: "u3",
    userName: "Thomas Weber",
    userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    lastMessage: "I'll be there in 10 minutes.",
    lastMessageTimestamp: "2025-04-09T14:30:00",
    unreadCount: 0,
    relatedItemType: "transport",
    relatedItemTitle: "Hamburg to Cologne"
  }
];

const mockMessages: Record<string, Message[]> = {
  c1: [
    {
      id: "m1",
      senderId: "u1",
      text: "Hello! I'm interested in your transport from Berlin to Munich.",
      timestamp: "2025-04-11T09:15:00",
      isRead: true
    },
    {
      id: "m2",
      senderId: "me",
      text: "Hi Max! I plan to leave around 2pm tomorrow. When would you like to drop off your package?",
      timestamp: "2025-04-11T09:20:00",
      isRead: true
    },
    {
      id: "m3",
      senderId: "u1",
      text: "I was thinking around 1pm, is that too early?",
      timestamp: "2025-04-11T09:22:00",
      isRead: true
    },
    {
      id: "m4",
      senderId: "me",
      text: "That works perfectly. Where would you like to meet?",
      timestamp: "2025-04-11T09:25:00",
      isRead: true
    },
    {
      id: "m5",
      senderId: "u1",
      text: "Can you pick it up at 3pm instead?",
      timestamp: "2025-04-11T10:23:00",
      isRead: false
    },
    {
      id: "m6",
      senderId: "u1",
      text: "Actually, I just realized 3pm is cutting it close. How about 2:30pm?",
      timestamp: "2025-04-11T10:25:00",
      isRead: false
    }
  ],
  c2: [
    {
      id: "m7",
      senderId: "me",
      text: "Hi Lisa, I saw your request for guitar transport. I'm heading that way tomorrow.",
      timestamp: "2025-04-10T15:45:00",
      isRead: true
    },
    {
      id: "m8",
      senderId: "u2",
      text: "That's great! It's in a hard case but please be careful with it.",
      timestamp: "2025-04-10T15:50:00",
      isRead: true
    },
    {
      id: "m9",
      senderId: "me",
      text: "No worries, I understand. I'm a guitarist myself so I know how to handle instruments.",
      timestamp: "2025-04-10T15:55:00",
      isRead: true
    },
    {
      id: "m10",
      senderId: "u2",
      text: "Perfect! Can we confirm the pickup details?",
      timestamp: "2025-04-10T16:00:00",
      isRead: true
    },
    {
      id: "m11",
      senderId: "me",
      text: "Sure, I'm free anytime after 2pm.",
      timestamp: "2025-04-10T16:02:00",
      isRead: true
    },
    {
      id: "m12",
      senderId: "u2",
      text: "I'll make sure to handle it carefully.",
      timestamp: "2025-04-10T16:05:00",
      isRead: true
    }
  ],
  c3: [
    {
      id: "m13",
      senderId: "u3",
      text: "Hello, I'm Thomas. I'd like to use your transport service from Hamburg to Cologne.",
      timestamp: "2025-04-09T14:00:00",
      isRead: true
    },
    {
      id: "m14",
      senderId: "me",
      text: "Hi Thomas! What would you like to send?",
      timestamp: "2025-04-09T14:05:00",
      isRead: true
    },
    {
      id: "m15",
      senderId: "u3",
      text: "It's a small package with some books, nothing fragile.",
      timestamp: "2025-04-09T14:10:00",
      isRead: true
    },
    {
      id: "m16",
      senderId: "me",
      text: "Perfect, that should be no problem. When would you like to meet?",
      timestamp: "2025-04-09T14:15:00",
      isRead: true
    },
    {
      id: "m17",
      senderId: "u3",
      text: "Are you available in the next hour?",
      timestamp: "2025-04-09T14:20:00",
      isRead: true
    },
    {
      id: "m18",
      senderId: "u3",
      text: "I'll be there in 10 minutes.",
      timestamp: "2025-04-09T14:30:00",
      isRead: true
    }
  ]
};

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>("c1");
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      text: messageText,
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    setMessages(prev => ({
      ...prev,
      [activeConversation]: [...prev[activeConversation], newMessage]
    }));
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation 
          ? {
              ...conv,
              lastMessage: messageText,
              lastMessageTimestamp: new Date().toISOString(),
              unreadCount: 0
            }
          : conv
      )
    );
    
    setMessageText("");
  };

  const handleConversationClick = (conversationId: string) => {
    setActiveConversation(conversationId);
    
    // Mark messages as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
    
    if (messages[conversationId]) {
      setMessages(prev => ({
        ...prev,
        [conversationId]: prev[conversationId].map(msg => ({ ...msg, isRead: true }))
      }));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-2">
              Chat with other users about transport requests and offers
            </p>
          </div>

          <div className="flex h-[calc(100vh-250px)] border rounded-lg overflow-hidden shadow-sm">
            {/* Conversation List */}
            <div className="w-1/3 border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-69px)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                      activeConversation === conversation.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleConversationClick(conversation.id)}
                  >
                    <div className="flex items-start">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img
                            src={conversation.userAvatar}
                            alt={conversation.userName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-brand-purple text-white text-xs flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-medium text-gray-900 truncate">
                            {conversation.userName}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatDate(conversation.lastMessageTimestamp)}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${
                          conversation.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-500"
                        }`}>
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center mt-1">
                          {conversation.relatedItemType === "transport" ? (
                            <Car className="h-3 w-3 text-brand-blue mr-1" />
                          ) : (
                            <Package className="h-3 w-3 text-brand-purple mr-1" />
                          )}
                          <span className="text-xs text-gray-500 truncate">
                            {conversation.relatedItemTitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div className="w-2/3 flex flex-col">
              {activeConversation ? (
                <>
                  <div className="p-4 border-b flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={conversations.find(c => c.id === activeConversation)?.userAvatar}
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {conversations.find(c => c.id === activeConversation)?.userName}
                      </h3>
                      <div className="flex items-center">
                        {conversations.find(c => c.id === activeConversation)?.relatedItemType === "transport" ? (
                          <Car className="h-3.5 w-3.5 text-brand-blue mr-1" />
                        ) : (
                          <Package className="h-3.5 w-3.5 text-brand-purple mr-1" />
                        )}
                        <span className="text-xs text-gray-500">
                          {conversations.find(c => c.id === activeConversation)?.relatedItemTitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages[activeConversation]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.senderId === "me"
                              ? "bg-brand-purple text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{message.text}</p>
                          <div
                            className={`text-xs mt-1 ${
                              message.senderId === "me" ? "text-white text-opacity-70" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex items-center">
                      <Input
                        placeholder="Type a message..."
                        className="flex-grow"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        className="ml-2"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
