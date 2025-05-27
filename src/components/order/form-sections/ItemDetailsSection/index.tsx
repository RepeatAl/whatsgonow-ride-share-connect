import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Trash2 } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface Item {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

interface Props {
  items: Item[];
  onItemsChange: (items: Item[]) => void;
}

const ItemDetailsSection: React.FC<Props> = ({ items, onItemsChange }) => {
  const { user } = useSimpleAuth();
  const [localItems, setLocalItems] = useState<Item[]>([]);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleAddItem = () => {
    const newItem: Item = {
      id: Math.random().toString(36).substring(7),
      name: `Item ${localItems.length + 1}`,
      quantity: 1,
      weight: 1,
      dimensions: { length: 1, width: 1, height: 1 },
    };
    const updatedItems = [...localItems, newItem];
    setLocalItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = localItems.filter((item) => item.id !== id);
    setLocalItems(updatedItems);
    onItemsChange(updatedItems);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Artikeldetails</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Badge variant="secondary">
            <Package className="h-4 w-4 mr-2" />
            {localItems.length} Artikel
          </Badge>
        </div>

        {localItems.map((item) => (
          <div key={item.id} className="mb-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">
                {item.name}
              </h4>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Menge: {item.quantity}, Gewicht: {item.weight} kg, Maße: {item.dimensions.length}x{item.dimensions.width}x{item.dimensions.height} cm
            </p>
          </div>
        ))}

        <Button variant="outline" className="w-full justify-center" onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Artikel hinzufügen
        </Button>
      </CardContent>
    </Card>
  );
};

export default ItemDetailsSection;
