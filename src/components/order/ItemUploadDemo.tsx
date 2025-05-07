
import React, { useState, useEffect } from "react";
import { ItemDetailsUpload } from "./form-sections/ItemDetailsUpload";
import { ItemDetails } from "@/hooks/useItemDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { PublishOrderButton } from "./PublishOrderButton";
import { supabase } from "@/lib/supabaseClient";

const ItemUploadDemo = () => {
  const [savedItems, setSavedItems] = useState<ItemDetails[]>([]);
  // Demo-Auftrags-ID, in der Produktion würde diese vom tatsächlichen Auftrag kommen
  const demoOrderId = uuidv4();
  const [isPublished, setIsPublished] = useState(false);

  // Überprüfen, ob der Auftrag bereits veröffentlicht wurde
  useEffect(() => {
    const checkPublishedStatus = async () => {
      // In einem echten Szenario würde hier der Auftragsstatus aus der Datenbank geladen
      // Für die Demo simulieren wir nur den Status
      const { data } = await supabase
        .from("orders")
        .select("published_at")
        .eq("id", demoOrderId)
        .single();

      setIsPublished(!!data?.published_at);
    };

    checkPublishedStatus();
  }, [demoOrderId]);

  const handleSaveItem = (item: ItemDetails) => {
    setSavedItems([...savedItems, { ...item }]);
  };

  const handlePublishSuccess = () => {
    setIsPublished(true);
    // Hier könnten weitere Aktionen nach erfolgreicher Veröffentlichung erfolgen
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-4">Artikel-Upload Demo</h1>
        <p className="text-gray-600 mb-6">
          Diese Seite demonstriert die Artikelverwaltung für Aufträge. 
          Hier können Sie Artikel mit Titel, Beschreibung und Bild hinzufügen.
        </p>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">
            Demo Auftrags-ID: {demoOrderId}
          </p>
          <PublishOrderButton 
            orderId={demoOrderId}
            isPublished={isPublished}
            onSuccess={handlePublishSuccess}
          />
        </div>
        
        <ItemDetailsUpload onSaveItem={handleSaveItem} orderId={demoOrderId} />
        
        {savedItems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Hinzugefügte Artikel</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                    )}
                    <p className="text-gray-700">{item.description || "Keine Beschreibung"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemUploadDemo;
