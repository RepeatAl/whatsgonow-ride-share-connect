
import { useState } from "react";
import Layout from "@/components/Layout";
import TransportCard from "@/components/transport/TransportCard";
import { mockTransports } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, Search } from "lucide-react";
import RouteMap from "@/components/map/RouteMap";

const FindTransport = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Transport</h1>
            <p className="text-gray-600 mt-2">
              Browse available drivers or create a new transport request
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
              <Clock className="h-5 w-5" />
              <span>Time</span>
            </Button>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </Button>

            <Button className="ml-auto">
              Create Request
            </Button>
          </div>

          <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="available" className="relative">
                Available Transports
                <Badge className="ml-2 px-1.5 py-0.5 bg-brand-purple text-white">
                  {mockTransports.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="create">Create Request</TabsTrigger>
            </TabsList>
            <TabsContent value="available" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTransports.map((transport) => (
                  <TransportCard key={transport.id} transport={transport} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="map" className="mt-6">
              <div className="rounded-lg overflow-hidden border shadow-sm bg-white p-4">
                <h2 className="text-xl font-semibold mb-4">Routes Map</h2>
                <div className="aspect-video w-full">
                  <RouteMap startPoint="Berlin" endPoint="Munich" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Select a route on the map to see available transports or switch to the list view for more details.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="create" className="mt-6">
              <div className="rounded-lg overflow-hidden border shadow-sm bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">Create Transport Request</h2>
                <p className="text-gray-600 mb-6">
                  Need something transported? Create a new request and connect with drivers heading your way.
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

export default FindTransport;
