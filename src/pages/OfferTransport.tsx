
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import RequestCard from "@/components/transport/RequestCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Filter, 
  MapPin, 
  Plus, 
  Search, 
  X, 
  Weight, 
  Truck,
  Gauge
} from "lucide-react";
import RouteMap from "@/components/map/RouteMap";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { TransportRequest } from "@/data/mockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const OfferTransport = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5);
  
  // Filter states
  const [timeWindow, setTimeWindow] = useState<[Date | null, Date | null]>([null, null]);
  const [maxWeight, setMaxWeight] = useState<number>(50);
  const [maxDistance, setMaxDistance] = useState<number>(100);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchMatchingOrders();
  }, [currentPage]);

  const fetchMatchingOrders = async () => {
    setIsLoading(true);
    
    // Simulate API call to GET /api/driver/orders/matches
    setTimeout(() => {
      // In a real app, this would be a fetch call
      import('@/data/mockData').then(({ mockRequests }) => {
        // Apply filters if needed
        const filteredRequests = mockRequests
          .filter(req => maxWeight ? req.itemDetails.weight <= maxWeight : true)
          .filter(req => {
            if (!searchQuery) return true;
            return (
              req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              req.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
              req.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase())
            );
          });
        
        setRequests(filteredRequests);
        setIsLoading(false);
      });
    }, 1000);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMatchingOrders();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchMatchingOrders();
  };

  const handleFilterApply = () => {
    setCurrentPage(1);
    fetchMatchingOrders();
    toast({
      title: "Filter angewendet",
      description: `Maximales Gewicht: ${maxWeight}kg, Maximale Entfernung: ${maxDistance}km`,
    });
  };

  const handleOfferSubmit = (requestId: string) => {
    // In a real app, this would redirect to an offer page
    console.log(`Offer submitted for request ${requestId}`);
    toast({
      title: "Angebot erstellt",
      description: "Sie werden zur Angebotsseite weitergeleitet.",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transportaufträge finden</h1>
              <p className="text-gray-600 mt-2">
                Finden Sie passende Transportaufträge und geben Sie Angebote ab
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-lg overflow-hidden shadow-md bg-white p-2 flex flex-col items-center justify-center text-center">
                <img 
                  src="/lovable-uploads/8abf4d13-a3a9-4304-b1aa-a707476db0a9.png" 
                  alt="Person mit Handy am Bahnhof" 
                  className="w-24 h-24 object-cover rounded-full mb-3"
                />
                <p className="text-sm font-medium">Verdiene während deiner Pendlerfahrt</p>
              </div>
              
              <div className="aspect-square rounded-lg overflow-hidden shadow-md bg-white p-2 flex flex-col items-center justify-center text-center">
                <img 
                  src="/lovable-uploads/50fc73f0-e0b0-449f-b3e0-baddc3075883.png" 
                  alt="Taxifahrer" 
                  className="w-24 h-24 object-cover rounded-full mb-3"
                />
                <p className="text-sm font-medium">Optimiere deine Taxifahrten</p>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-4">
            <div className="flex-grow max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Suche nach Standort, Route oder Daten..."
                  className="pl-10 pr-10 py-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={clearSearch}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Zeitfenster</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Abholzeitfenster</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Von - Bis</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal"
                      onClick={() => {
                        // Date picker would go here in a real implementation
                        toast({
                          title: "Zeitfenster ausgewählt",
                          description: "Ihre Zeitfenster wurden aktualisiert.",
                        });
                      }}
                    >
                      Datum und Uhrzeit auswählen
                    </Button>
                  </div>
                  <Button className="w-full" onClick={handleFilterApply}>Anwenden</Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Weight className="h-5 w-5" />
                  <span>Max. Gewicht</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Maximales Gewicht</h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">0 kg</span>
                      <span className="text-sm font-medium">{maxWeight} kg</span>
                      <span className="text-sm text-gray-500">100 kg</span>
                    </div>
                    <Slider 
                      defaultValue={[50]} 
                      max={100} 
                      step={1} 
                      onValueChange={(value) => setMaxWeight(value[0])}
                    />
                  </div>
                  <Button className="w-full" onClick={handleFilterApply}>Anwenden</Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Distanz</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Maximale Entfernung zum Startpunkt</h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">0 km</span>
                      <span className="text-sm font-medium">{maxDistance} km</span>
                      <span className="text-sm text-gray-500">200 km</span>
                    </div>
                    <Slider 
                      defaultValue={[100]} 
                      max={200} 
                      step={5} 
                      onValueChange={(value) => setMaxDistance(value[0])}
                    />
                  </div>
                  <Button className="w-full" onClick={handleFilterApply}>Anwenden</Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                const allFilters = document.querySelectorAll('[data-state="closed"]');
                allFilters.forEach((filter) => {
                  // This would ideally be handled properly with refs
                  console.log("Resetting filters");
                });
                setMaxWeight(50);
                setMaxDistance(100);
                setTimeWindow([null, null]);
                handleFilterApply();
              }}
            >
              <Filter className="h-5 w-5" />
              <span>Filter zurücksetzen</span>
            </Button>

            <Button className="ml-auto" onClick={() => setActiveTab("create")}>
              <Plus className="h-5 w-5 mr-2" />
              Transport anbieten
            </Button>
          </div>

          <Tabs defaultValue="requests" className="w-full" onValueChange={setActiveTab} value={activeTab}>
            <TabsList>
              <TabsTrigger value="requests" className="relative">
                Transportaufträge
                <Badge className="ml-2 px-1.5 py-0.5 bg-brand-primary text-white">
                  {requests.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="map">Kartenansicht</TabsTrigger>
              <TabsTrigger value="create">Transport anbieten</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Zeige {requests.length} Ergebnisse
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Sortieren nach:</span>
                      <select className="border rounded p-1 text-sm">
                        <option>Match Score</option>
                        <option>Distanz</option>
                        <option>Preis</option>
                        <option>Datum</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                      <div key={request.id} className="relative">
                        <div className="absolute top-2 right-2 z-10 bg-brand-primary text-white rounded-full px-2 py-1 text-xs font-bold flex items-center">
                          <Gauge className="h-3 w-3 mr-1" />
                          {Math.floor(Math.random() * 30) + 70}% Match
                        </div>
                        <RequestCard 
                          key={request.id} 
                          request={request} 
                        />
                        <div className="mt-2">
                          <Button 
                            className="w-full bg-brand-primary hover:bg-brand-primary/90"
                            onClick={() => handleOfferSubmit(request.id)}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Angebot abgeben
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination className="my-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                            }
                          }}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            href="#" 
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="map" className="mt-6">
              <div className="rounded-lg overflow-hidden border shadow-sm bg-white p-4">
                <h2 className="text-xl font-semibold mb-4">Transportaufträge auf der Karte</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="aspect-[3/2] w-full">
                      <RouteMap startPoint="Hamburg" endPoint="Berlin" />
                    </div>
                  </div>
                  
                  <div className="overflow-auto max-h-[500px] border rounded">
                    <div className="p-4">
                      <h3 className="font-medium mb-2">Verfügbare Aufträge entlang Ihrer Route</h3>
                      <div className="space-y-4">
                        {requests.slice(0, 5).map((request) => (
                          <div key={request.id} className="border-b pb-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{request.title}</h4>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {Math.floor(Math.random() * 30) + 70}%
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{request.pickupLocation} → {request.deliveryLocation}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm">{request.itemDetails.weight}kg</span>
                              <span className="font-medium text-brand-primary">€{request.budget}</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2 bg-brand-primary text-white hover:bg-brand-primary/90"
                              onClick={() => handleOfferSubmit(request.id)}
                            >
                              Angebot abgeben
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <img 
                      src="/lovable-uploads/1310b47b-6ab3-443c-88cc-2b6fe8b77f0c.png" 
                      alt="Cargo bike delivery" 
                      className="w-full h-32 object-cover rounded-lg mb-2" 
                    />
                    <p className="text-sm font-medium">Flexible Lieferungen in der Stadt</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <img 
                      src="/lovable-uploads/38c76c60-9ce4-40c9-b580-8da351655c67.png" 
                      alt="Family car delivery" 
                      className="w-full h-32 object-cover rounded-lg mb-2" 
                    />
                    <p className="text-sm font-medium">Lieferungen mit der Familie</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <img 
                      src="/lovable-uploads/ed030dd7-9b8a-4d00-8785-1a05147bba2c.png" 
                      alt="Bus driver delivery" 
                      className="w-full h-32 object-cover rounded-lg mb-2" 
                    />
                    <p className="text-sm font-medium">Lieferungen während der Busfahrt</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <img 
                      src="/lovable-uploads/25ba838f-17f9-4e58-9599-0dc83993fe74.png" 
                      alt="Airplane passenger delivery" 
                      className="w-full h-32 object-cover rounded-lg mb-2" 
                    />
                    <p className="text-sm font-medium">Internationale Lieferungen</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="create" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-lg overflow-hidden border shadow-sm bg-white p-6">
                  <h2 className="text-xl font-semibold mb-4">Transport anbieten</h2>
                  <p className="text-gray-600 mb-6">
                    Teilen Sie mit, dass Sie unterwegs sind und Gegenstände auf Ihrer Route transportieren können.
                  </p>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Von</label>
                      <Input placeholder="Startort eingeben" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Nach</label>
                      <Input placeholder="Zielort eingeben" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Datum und Uhrzeit</label>
                      <Input type="datetime-local" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Verfügbare Kapazität</label>
                      <Input type="number" placeholder="Max. Gewicht in kg" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Transportmittel</label>
                      <select className="w-full border rounded-md h-10 px-3">
                        <option>Auto</option>
                        <option>Fahrrad</option>
                        <option>Bus</option>
                        <option>Bahn</option>
                        <option>Flugzeug</option>
                      </select>
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-brand-primary hover:bg-brand-primary/90"
                      onClick={(e) => {
                        e.preventDefault();
                        toast({
                          title: "Transport angeboten",
                          description: "Ihr Transportangebot wurde erfolgreich erstellt!",
                        });
                      }}
                    >
                      Transport anbieten
                    </Button>
                  </form>
                </div>
                
                <div className="rounded-lg overflow-hidden border shadow-sm bg-white p-6">
                  <h2 className="text-xl font-semibold mb-4">Vorteile als Fahrer</h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="/lovable-uploads/50fc73f0-e0b0-449f-b3e0-baddc3075883.png"
                          alt="Taxi driver" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">Zusätzliches Einkommen</h3>
                        <p className="text-sm text-gray-600">Verdienen Sie zusätzliches Geld mit Fahrten, die Sie sowieso machen.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="/lovable-uploads/1310b47b-6ab3-443c-88cc-2b6fe8b77f0c.png" 
                          alt="Bike delivery" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">Flexible Zeiten</h3>
                        <p className="text-sm text-gray-600">Sie entscheiden selbst, wann und wie viel Sie transportieren möchten.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="/lovable-uploads/38c76c60-9ce4-40c9-b580-8da351655c67.png" 
                          alt="Family car" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">Umweltbewusst</h3>
                        <p className="text-sm text-gray-600">Helfen Sie, Lieferverkehr zu reduzieren und die Umwelt zu schonen.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="/lovable-uploads/25ba838f-17f9-4e58-9599-0dc83993fe74.png" 
                          alt="Passenger with document" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">Hilfe für andere</h3>
                        <p className="text-sm text-gray-600">Unterstützen Sie andere Menschen, die dringend Gegenstände transportieren müssen.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default OfferTransport;
