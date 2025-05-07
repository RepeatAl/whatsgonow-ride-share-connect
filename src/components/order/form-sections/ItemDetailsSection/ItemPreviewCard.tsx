
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ItemPreviewCardProps } from "./types";

export function ItemPreviewCard({ item, index, onRemove }: ItemPreviewCardProps) {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="truncate pr-6">{item.title}</span>
          <Button 
            variant="ghost" 
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {item.imageUrl && (
          <div className="relative w-full h-32 mb-3">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-cover rounded-md" 
            />
          </div>
        )}
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
