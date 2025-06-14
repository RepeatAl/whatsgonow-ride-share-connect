
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Shield, LayoutDashboard, Users, MessageCircle, Home } from "lucide-react";
import Layout from "@/components/Layout";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";

// This component follows the conventions from /docs/conventions/roles_and_ids.md
const adminNavItems = [
  {
    title: "Home",
    icon: Home,
    path: "/admin",
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    title: "Pre-Registrations",
    icon: Shield,
    path: "/admin/pre-registrations",
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Feedback",
    icon: MessageCircle,
    path: "/admin/feedback",
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { profile } = useOptimizedAuth();

  // Redirect non-admin users
  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    navigate('/dashboard');
    return null;
  }

  return (
    <Layout>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.path}
                        end={item.path === "/admin"}
                        className={({ isActive }) =>
                          `flex items-center gap-2 ${
                            isActive ? "text-primary font-medium" : "text-muted-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;
