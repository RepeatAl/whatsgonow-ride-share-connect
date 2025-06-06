import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Package, Truck } from 'lucide-react';
import { Handshake, MessageCircle, User } from 'lucide-react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

const DealPanel = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { user } = useOptimizedAuth();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeal = async () => {
      if (!dealId) return;
      
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetch(`/api/deals/${dealId}`);
        if (!response.ok) throw new Error('Failed to fetch deal');
        
        const data = await response.json();
        setDeal(data);
      } catch (err) {
        console.error('Error fetching deal:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [dealId]);

  const handleAccept = async () => {
    try {
      // Replace with your actual API call
      await fetch(`/api/deals/${dealId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error accepting deal:', err);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !deal) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Error loading deal</h3>
            <p className="text-muted-foreground">{error || 'Deal not found'}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Transport #{deal.reference}</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Posted {new Date(deal.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge variant={deal.status === 'open' ? 'default' : 'secondary'}>
            {deal.status === 'open' ? 'Available' : 'Closed'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Locations */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium">Route</h3>
              <p className="text-sm">{deal.pickupLocation}</p>
              <p className="text-sm text-muted-foreground">to</p>
              <p className="text-sm">{deal.deliveryLocation}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Distance: {deal.distance} km
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Schedule */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium">Schedule</h3>
              <p className="text-sm">
                Pickup: {new Date(deal.pickupDate).toLocaleDateString()} 
                {deal.pickupTimeWindow && ` (${deal.pickupTimeWindow})`}
              </p>
              <p className="text-sm">
                Delivery: {new Date(deal.deliveryDate).toLocaleDateString()}
                {deal.deliveryTimeWindow && ` (${deal.deliveryTimeWindow})`}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Cargo */}
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium">Cargo Details</h3>
              <p className="text-sm">{deal.cargoType}</p>
              <p className="text-sm">Weight: {deal.weight} kg</p>
              <p className="text-sm">Dimensions: {deal.dimensions}</p>
              {deal.specialRequirements && (
                <div className="mt-1">
                  <Badge variant="outline">Special Requirements</Badge>
                  <p className="text-xs mt-1">{deal.specialRequirements}</p>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Vehicle */}
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium">Vehicle Requirements</h3>
              <p className="text-sm">{deal.vehicleType}</p>
              {deal.vehicleRequirements && (
                <p className="text-xs text-muted-foreground mt-1">
                  {deal.vehicleRequirements}
                </p>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Price */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Offered Price</h3>
              <p className="text-2xl font-bold">€{deal.price.toFixed(2)}</p>
            </div>
            
            {deal.status === 'open' && (
              <Button onClick={handleAccept} className="px-8">
                Accept Deal
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealPanel;
