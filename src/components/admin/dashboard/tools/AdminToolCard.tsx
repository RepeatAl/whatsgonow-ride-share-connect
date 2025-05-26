
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface AdminToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'active' | 'inactive' | 'pending';
  onClick: () => void;
  badge?: string;
}

const AdminToolCard: React.FC<AdminToolCardProps> = ({
  title,
  description,
  icon: Icon,
  status,
  onClick,
  badge
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'; // Changed from 'success' to 'default'
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
        <Badge variant={getStatusColor(status)}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs text-muted-foreground mb-3">
          {description}
        </CardDescription>
        {badge && (
          <Badge variant="outline" className="mb-2">
            {badge}
          </Badge>
        )}
        <Button size="sm" variant="outline" className="w-full">
          Öffnen
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminToolCard;
