
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Headphones } from "lucide-react";

export const ContactMethods = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <Card>
        <CardHeader className="items-center text-center">
          <MessageSquare className="h-8 w-8 text-brand-primary mb-2" />
          <CardTitle>Live Chat</CardTitle>
          <CardDescription>Verfügbar 9 - 19 Uhr</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" className="w-full">
            Chat starten
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="items-center text-center">
          <Mail className="h-8 w-8 text-brand-primary mb-2" />
          <CardTitle>E-Mail-Support</CardTitle>
          <CardDescription>Antwort innerhalb von 24h</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" className="w-full">
            admin@whatsgonow.com
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="items-center text-center">
          <Headphones className="h-8 w-8 text-brand-primary mb-2" />
          <CardTitle>Telefon-Support</CardTitle>
          <CardDescription>Mo-Fr: 9 - 17 Uhr</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" className="w-full">
            +1 (800) 123-4567
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
