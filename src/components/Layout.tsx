
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { UserSuspensionNotice } from "@/components/suspension";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto">
          {user && <UserSuspensionNotice userId={user.id} />}
          {children}
        </div>
      </main>
      {!hideFooter && <Footer />}
      <Toaster />
    </div>
  );
};

export default Layout;
