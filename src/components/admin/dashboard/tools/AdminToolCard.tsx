
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AdminToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status?: 'active' | 'inactive' | 'maintenance';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
}

const AdminToolCard: React.FC<AdminToolCardProps> = ({
  title,
  description,
  icon: Icon,
  status = 'active',
  href,
  onClick,
  disabled = false,
  badge
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (disabled) {
      return <div className="opacity-50 cursor-not-allowed">{children}</div>;
    }
    
    if (href) {
      return <Link to={href} className="block">{children}</Link>;
    }
    
    if (onClick) {
      return <div onClick={onClick} className="cursor-pointer">{children}</div>;
    }
    
    return <div>{children}</div>;
  };

  return (
    <CardWrapper>
      <Card className={`h-full transition-all duration-200 ${!disabled && (href || onClick) ? 'hover:shadow-lg hover:scale-105' : ''}`}>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="p-2 rounded-lg bg-brand-orange/10">
            <Icon className="h-6 w-6 text-brand-orange" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <Badge className={`text-xs ${getStatusColor()}`}>
              {status === 'active' ? 'Aktiv' : status === 'inactive' ? 'Inaktiv' : 'Wartung'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-600">
            {description}
          </CardDescription>
        </CardContent>
        {(href || onClick) && !disabled && (
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Öffnen
            </Button>
          </CardFooter>
        )}
      </Card>
    </CardWrapper>
  );
};

export default AdminToolCard;
