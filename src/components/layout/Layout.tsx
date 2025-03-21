
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Users,
  UserCircle,
  Calendar,
  FileText,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { professionals } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  label, 
  active,
  compact
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  active: boolean;
  compact?: boolean;
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        active 
          ? "bg-therapy-500 text-white" 
          : "hover:bg-therapy-100 text-gray-700 hover:text-therapy-700",
        compact && "justify-center px-2"
      )}
    >
      <Icon className="h-5 w-5" />
      {!compact && <span className="font-medium">{label}</span>}
    </Link>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  
  // Close sidebar on mobile when navigating to a new page
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [location.pathname, isMobile]);
  
  // Initialize sidebar based on device
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // Mock logged in professional for demo
  const currentProfessional = professionals[0];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationLinks = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/patients", label: "Pacientes", icon: Users },
    { path: "/profile", label: "Mi Perfil", icon: UserCircle },
    { path: "/sessions", label: "Sesiones", icon: Calendar },
    { path: "/reports", label: "Informes", icon: FileText },
  ];

  // Show sidebar as overlay on mobile
  const mobileVariants = {
    open: { 
      x: 0,
      boxShadow: "10px 0px 50px rgba(0,0,0,0.15)",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      x: "-100%", 
      boxShadow: "none",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  // Desktop sidebar width variants
  const desktopVariants = {
    open: { width: "280px", transition: { duration: 0.3 } },
    closed: { width: "80px", transition: { duration: 0.3 } }
  };

  // Content padding adjustment
  const contentDesktopVariants = {
    open: { marginLeft: "280px", transition: { duration: 0.3 } },
    closed: { marginLeft: "80px", transition: { duration: 0.3 } }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-sm",
          isMobile ? "w-[280px]" : "w-auto"
        )}
        initial={isMobile ? "closed" : "open"}
        animate={sidebarOpen ? "open" : "closed"}
        variants={isMobile ? mobileVariants : desktopVariants}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {(sidebarOpen || isMobile) && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-therapy-500 flex items-center justify-center">
                <span className="text-white font-bold">TS</span>
              </div>
              <h1 className="text-lg font-display font-semibold">TerapiaSoft</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          {navigationLinks.map((link) => (
            <SidebarLink
              key={link.path}
              to={link.path}
              icon={link.icon}
              label={link.label}
              active={currentPath === link.path}
              compact={!sidebarOpen && !isMobile}
            />
          ))}
        </div>
        
        <div className="border-t p-4">
          {sidebarOpen || isMobile ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img
                  src={currentProfessional.avatar}
                  alt={currentProfessional.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentProfessional.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentProfessional.specialty}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="mx-auto">
              <UserCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      </motion.aside>

      {/* Mobile header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-therapy-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">TS</span>
            </div>
            <h1 className="text-lg font-display font-semibold">TerapiaSoft</h1>
          </div>
        </div>
      )}

      {/* Main content */}
      <motion.main
        className={cn(
          "flex-1 transition-all duration-300 pb-12",
          isMobile ? "mt-16 w-full" : ""
        )}
        initial={isMobile ? {} : "open"}
        animate={!isMobile && sidebarOpen ? "open" : "closed"}
        variants={!isMobile ? contentDesktopVariants : {}}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
              isMobile && "px-3 py-3"
            )}
          >
            {/* Mobile back button on patient detail pages */}
            {isMobile && location.pathname.includes("/patients/") && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-2 -ml-2 px-2"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            )}
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default Layout;
