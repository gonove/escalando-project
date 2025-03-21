
import React, { useState } from "react";
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
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { professionals } from "@/data/mockData";

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  label, 
  active 
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  active: boolean;
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        active 
          ? "bg-therapy-500 text-white" 
          : "hover:bg-therapy-100 text-gray-700 hover:text-therapy-700"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;
  
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

  const sidebarVariants = {
    open: { width: "280px", transition: { duration: 0.3 } },
    closed: { width: "80px", transition: { duration: 0.3 } }
  };

  const contentVariants = {
    open: { marginLeft: "280px", transition: { duration: 0.3 } },
    closed: { marginLeft: "80px", transition: { duration: 0.3 } }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-sm"
        initial="open"
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
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
            />
          ))}
        </div>
        
        <div className="border-t p-4">
          {sidebarOpen ? (
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

      {/* Main content */}
      <motion.main
        className="flex-1 transition-all duration-300 pb-12"
        initial="open"
        animate={sidebarOpen ? "open" : "closed"}
        variants={contentVariants}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default Layout;
