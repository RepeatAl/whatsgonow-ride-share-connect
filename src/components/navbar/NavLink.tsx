
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface NavLinkProps {
  to: string;
  icon: ReactNode;
  name: string;
  tooltip: string;
  onClick?: () => void;
  badge?: number;
}

const NavLink = ({ to, icon, name, tooltip, onClick, badge }: NavLinkProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={to}
          className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 relative"
          onClick={onClick}
        >
          {icon}
          <span>{name}</span>
          {badge !== undefined && badge > 0 && (
            <div className="ml-1 h-5 w-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
              {badge > 9 ? '9+' : badge}
            </div>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default NavLink;
