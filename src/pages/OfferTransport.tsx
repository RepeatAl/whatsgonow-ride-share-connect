
import { useState } from "react";
import Layout from "@/components/Layout";
import RequestCard from "@/components/transport/RequestCard";
import { mockRequests } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, MapPin, Plus, Search, X } from "lucide-react";
import RouteMap from "@/components/map/RouteMap";

const OfferTransport = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Offer Transport</h1>
            <p className="text-gray-600 mt-2">
              Browse transport requests or create a new transport offer
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-4">
            <div className="flex-grow max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by location, route or dates..."
                  className="pl-10 pr-10 py-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Date</span>
            </Button>

            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Area</span>
            </Button>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </Button>

            <Button className="ml-auto">
              <Plus className="h-5 w-5 mr-2" />
              Offer Transport
            </Button>
          </div>

          <Tabs defaultValue="requests" className="w-full" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="requests" className="relative">
                Transport Requests
                <Badge className="ml-2 px-1.5 py-0.5 bg-brand-purple text-white">
                  {mockRequests.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="create">Create Offer</TabsTrigger>
            </TabsList>
            <TabsContent value="requests" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="map" className="mt-6">
              <div className="rounded-lg overflow-hidden border shadow-sm bg-white p-4">
                <h2 className="text-xl font-semibold mb-4">Transport Requests Map</h2>
                <div className="aspect-video w-full">
                  <RouteMap startPoint="Hamburg" endPoint="Berlin" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    View transport requests on the map to find opportunities along your route.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="create" className="mt-6">
              <div className="rounded-lg overflow-hidden border shadow-sm bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">Create Transport Offer</h2>
                <p className="text-gray-600 mb-6">
                  Let people know you're traveling and can transport items along your route.
                </p>
                
                <p className="text-sm text-gray-500 mt-4">
                  This feature will be implemented soon.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default OfferTransport;
