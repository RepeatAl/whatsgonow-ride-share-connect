
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RoleTabContentProps {
  title: string;
  description?: string;
}

export function RoleTabContent({ title, description }: RoleTabContentProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description || "Hier kannst du deine rollenspezifischen Einstellungen verwalten."}</p>
      </CardContent>
    </Card>
  );
}
