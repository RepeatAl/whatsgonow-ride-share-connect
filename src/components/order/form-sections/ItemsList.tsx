
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ItemDetails } from "@/hooks/useItemDetails";

interface ItemsListProps {
  items: ItemDetails[];
  onRemoveItem: (index: number) => void;
}

export const ItemsList: React.FC<ItemsListProps> = ({ items, onRemoveItem }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Hinzugefügte Artikel ({items.length})</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="truncate pr-6">{item.title}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => onRemoveItem(index)}
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
        ))}
      </div>
    </div>
  );
};
