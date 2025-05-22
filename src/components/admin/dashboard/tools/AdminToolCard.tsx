
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface AdminToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  badge?: string;
  disabled?: boolean;
}

const AdminToolCard = ({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  badge,
  disabled 
}: AdminToolCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Icon className="mr-2 h-5 w-5 text-primary" />
          {title}
          {badge && (
            <Badge className="ml-2" variant="success">
              {badge}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <Button 
          variant="outline" 
          className="w-full justify-between" 
          disabled={disabled}
          asChild={!disabled && !!href}
        >
          {!disabled && href ? (
            <Link to={href}>
              {disabled ? 'In Entwicklung' : 'Öffnen'}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              In Entwicklung
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminToolCard;
