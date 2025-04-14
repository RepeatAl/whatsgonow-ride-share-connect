
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDealOffers, Offer } from '@/hooks/use-deal-offers';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Send, Check, X } from 'lucide-react';

interface DealPanelProps {
  order_id: string;
  user: User | null;
  userRole: 'driver' | 'sender';
}

export const DealPanel: React.FC<DealPanelProps> = ({ 
  order_id, 
  user, 
  userRole 
}) => {
  const [offerPrice, setOfferPrice] = useState('');
  const { offers, loading, submitOffer, updateOfferStatus } = useDealOffers(order_id, user);

  const handleSubmitOffer = async () => {
    const price = parseFloat(offerPrice);
    if (isNaN(price) || price <= 0) {
      alert('Bitte geben Sie einen gültigen Preis ein');
      return;
    }
    
    await submitOffer(price);
    setOfferPrice('');
  };

  const renderDriverView = () => (
    <div className="space-y-4">
      <div>
        <Label>Preis für den Auftrag</Label>
        <div className="flex gap-2 mt-2">
          <Input 
            type="number" 
            placeholder="Preis eingeben" 
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            min="0"
            step="0.01"
          />
          <Button onClick={handleSubmitOffer}>
            <Send className="mr-2 h-4 w-4" /> Angebot senden
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSenderView = () => (
    <div className="space-y-4">
      {loading ? (
        <p>Lade Angebote...</p>
      ) : offers.length === 0 ? (
        <p>Noch keine Angebote eingegangen</p>
      ) : (
        offers.map((offer) => (
          <OfferCard 
            key={offer.offer_id} 
            offer={offer} 
            onAccept={() => updateOfferStatus(offer.offer_id, 'angenommen')}
            onReject={() => updateOfferStatus(offer.offer_id, 'abgelehnt')}
          />
        ))
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {userRole === 'driver' ? 'Dein Angebot' : 'Eingegangene Angebote'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userRole === 'driver' ? renderDriverView() : renderSenderView()}
      </CardContent>
    </Card>
  );
};

const OfferCard: React.FC<{
  offer: Offer;
  onAccept: () => void;
  onReject: () => void;
}> = ({ offer, onAccept, onReject }) => {
  return (
    <Card className={`${offer.status === 'angenommen' ? 'border-green-500' : ''}`}>
      <CardContent className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <DollarSign className="h-6 w-6 text-gray-500" />
          <div>
            <p className="font-semibold">{formatCurrency(offer.price)}</p>
            <p className="text-sm text-gray-500">
              {offer.status === 'eingereicht' && 'Neues Angebot'}
              {offer.status === 'angenommen' && 'Akzeptiert'}
              {offer.status === 'abgelehnt' && 'Abgelehnt'}
            </p>
          </div>
        </div>
        {offer.status === 'eingereicht' && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAccept}
            >
              <Check className="mr-2 h-4 w-4" /> Annehmen
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onReject}
            >
              <X className="mr-2 h-4 w-4" /> Ablehnen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
