
import React from "react";
import { ItemListProps } from "./types";
import { ItemPreviewCard } from "./ItemPreviewCard";

export function ItemList({ items, onRemoveItem }: ItemListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Hinzugefügte Artikel ({items.length})</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <ItemPreviewCard 
            key={index}
            item={item}
            index={index}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
}
