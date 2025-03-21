
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-therapy-50 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-therapy-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-display font-semibold mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-2">Página no encontrada</p>
        <p className="text-gray-500 mb-8">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        
        <Link to="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
