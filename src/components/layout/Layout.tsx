import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useIsMobile, useIsTablet, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/theme/ThemeToggle";

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
          ? "bg-escalando-400 text-black font-medium"
          : "hover:bg-escalando-100 text-gray-700 hover:text-escalando-700",
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
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = useIsMobileOrTablet();
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else if (!isMobileOrTablet) {
      setSidebarOpen(true);
    }
  }, [location.pathname, isMobile, isMobileOrTablet]);

  useEffect(() => {
    setSidebarOpen(!isMobileOrTablet);
  }, [isMobileOrTablet]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const navigationLinks = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/patients", label: "Pacientes", icon: Users },
    { path: "/profile", label: "Mi Perfil", icon: UserCircle },
    { path: "/sessions", label: "Sesiones", icon: Calendar },
    { path: "/reports", label: "Informes", icon: FileText },
  ];

  if (isAdmin) {
    navigationLinks.push({ path: "/admin", label: "Administración", icon: Settings });
  }

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      {isMobileOrTablet && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-sm transition-transform duration-300",
          isMobileOrTablet && !sidebarOpen ? "-translate-x-full" : "translate-x-0",
          !isMobileOrTablet && !sidebarOpen ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {(sidebarOpen || !isMobileOrTablet) && (
            <div className={cn("flex items-center gap-2", !sidebarOpen && !isMobileOrTablet && "justify-center w-full")}>
              <div className="h-8 w-8 rounded-lg bg-escalando-400 flex items-center justify-center">
                <span className="text-black font-bold">E</span>
              </div>
              {(sidebarOpen || isMobileOrTablet) && (
                <h1 className="text-lg font-display font-semibold">Escalando</h1>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("ml-auto", !sidebarOpen && !isMobileOrTablet && "ml-0")}
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
              compact={!sidebarOpen && !isMobileOrTablet}
            />
          ))}
        </div>

        <div className="border-t border-border p-4">
          {(sidebarOpen || isMobileOrTablet) ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.user_metadata?.name || user?.email}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.user_metadata?.specialty || "Profesional"}</p>
              </div>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>Mi Perfil</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="mx-auto">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Mi Perfil</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {isMobileOrTablet && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="h-7 w-7 rounded-md bg-escalando-400 flex items-center justify-center">
              <span className="text-black font-bold text-xs">E</span>
            </div>
            <h1 className="text-lg font-display font-semibold">Escalando</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>Mi Perfil</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex-1 w-full transition-all duration-300",
          isMobileOrTablet ? "mt-16 px-0" : "",
          !isMobileOrTablet && sidebarOpen ? "ml-64" : "",
          !isMobileOrTablet && !sidebarOpen ? "ml-20" : ""
        )}
      >
        <main className="w-full pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6",
                isMobileOrTablet && "px-3 py-3"
              )}
            >
              {isMobileOrTablet && location.pathname.includes("/patients/") && (
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
        </main>
      </div>
    </div>
  );
};

export default Layout;
