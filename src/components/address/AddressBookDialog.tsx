
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAddressBook } from '@/hooks/useAddressBook';
import { AddressBookEntry } from '@/hooks/useAddressBook';
import { Loader2 } from 'lucide-react';

interface AddressBookDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (address: AddressBookEntry) => void;
  type?: 'pickup' | 'delivery';
}

export function AddressBookDialog({
  open,
  onClose,
  onSelect,
  type = 'delivery'
}: AddressBookDialogProps) {
  const { addresses, loading, fetchAddresses } = useAddressBook();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Load addresses when dialog opens
  useEffect(() => {
    if (open) {
      fetchAddresses();
    }
  }, [open, fetchAddresses]);

  // Set default selection
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(addresses[0].id);
      }
    }
  }, [addresses]);

  const handleSelect = () => {
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddress) {
      onSelect(selectedAddress);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adresse aus Adressbuch wählen</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Keine gespeicherten Adressen gefunden.</p>
          </div>
        ) : (
          <RadioGroup 
            value={selectedAddressId || ''}
            onValueChange={setSelectedAddressId}
            className="space-y-3 max-h-96 overflow-auto py-2"
          >
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className={`flex items-start space-x-3 p-3 border rounded-md ${address.id === selectedAddressId ? 'border-primary' : 'border-input'}`}
              >
                <RadioGroupItem value={address.id || ''} id={address.id} />
                <div className="flex flex-col space-y-1">
                  {address.name && <p className="font-medium">{address.name}</p>}
                  <p>{address.street} {address.house_number}</p>
                  <p>{address.postal_code} {address.city}</p>
                  {address.address_extra && <p className="text-sm text-muted-foreground">{address.address_extra}</p>}
                  <div className="flex flex-col text-sm text-muted-foreground">
                    {address.phone && <p>{address.phone}</p>}
                    {address.email && <p>{address.email}</p>}
                  </div>
                  {address.is_default && (
                    <span className="inline-flex mt-1 items-center rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                      Standardadresse
                    </span>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        )}

        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button 
            variant="default" 
            onClick={handleSelect}
            disabled={!selectedAddressId || addresses.length === 0}
          >
            Übernehmen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
