
import React from "react";
import { MessageSquare } from "lucide-react";

export const ConversationEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="font-medium text-lg mb-1">Keine Nachrichten</h3>
      <p className="text-muted-foreground text-sm">
        Starte einen Chat mit einem Transporteur oder Versender
      </p>
    </div>
  );
};
