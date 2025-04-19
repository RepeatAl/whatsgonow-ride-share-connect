
import { Outlet } from "react-router-dom";
import { Shield, LayoutDashboard, Users, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const adminNavItems = [
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
    icon: MessageSquare,
    path: "/admin/feedback",
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Redirect non-admin users
  if (!profile || profile.role !== 'admin') {
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
                    <SidebarMenuButton
                      asChild
                      onClick={() => navigate(item.path)}
                    >
                      <button>
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;
