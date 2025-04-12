
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCheck, Phone, Mail, FileText, AlertTriangle, HelpCircle } from "lucide-react";

export const SupportTools = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tools</CardTitle>
        <CardDescription>Quick actions to help community members</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="kyc">
          <TabsList className="mb-4">
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
            <TabsTrigger value="contact">Contact Center</TabsTrigger>
            <TabsTrigger value="dispute">Dispute Resolution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kyc" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium">Pending Verifications</h3>
                  </div>
                  <p className="text-3xl font-bold mb-2">12</p>
                  <Button size="sm" className="w-full">View Queue</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <h3 className="font-medium">Rejected Documents</h3>
                  </div>
                  <p className="text-3xl font-bold mb-2">3</p>
                  <Button size="sm" variant="outline" className="w-full">Review</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Verification Templates</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Standard messaging for approvals/rejections
                  </p>
                  <Button size="sm" variant="outline" className="w-full">Manage Templates</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Phone Support</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Call users directly from the dashboard
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Center
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">Email Support</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Send bulk or targeted emails to users
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Center
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="dispute" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h3 className="font-medium">Active Disputes</h3>
                  </div>
                  <p className="text-3xl font-bold mb-2">5</p>
                  <Button size="sm" className="w-full">Manage Disputes</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Help Resources</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Guidelines and policies for dispute resolution
                  </p>
                  <Button size="sm" variant="outline" className="w-full">View Resources</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
