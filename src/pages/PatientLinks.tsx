import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText,
  Camera,
  Home,
  Receipt,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { patients } from "@/data/mockData";

const PatientLinks = () => {
  const { patientId } = useParams();
  const isMobile = useIsMobile();

  // Find patient by ID, or use first patient as fallback
  const patient = patients.find(p => p.id === patientId) || patients[0];

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const linkButtons = [
    {
      label: "Informes - Mis avances",
      icon: FileText,
      color: "bg-cyan-400 hover:bg-cyan-500",
      link: `/reports/shared/${patient.id}`
    },
    {
      label: "Fotos",
      icon: Camera,
      color: "bg-orange-400 hover:bg-orange-500",
      link: "#photos"
    },
    {
      label: "Ejercicios en casa",
      icon: Home,
      color: "bg-emerald-400 hover:bg-emerald-500",
      link: "#exercises"
    },
    {
      label: "Facturas y detalles",
      icon: Receipt,
      color: "bg-red-400 hover:bg-red-500",
      link: "#invoices"
    }
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-10 pb-20 px-4 sm:px-6"
      style={{
        background: "linear-gradient(135deg, #fef9c3 0%, #facc15 100%)",
        // backgroundImage: `url('https://www.vecteezy.com/free-photos/smiling-baby')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="w-full max-w-md mx-auto">
        {/* Avatar and Name */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-3xl overflow-hidden border-4 border-white shadow-lg mb-4" style={{ padding: 4, background: "#ff8e8e" }}>
            <Avatar className="w-32 h-32">
              <AvatarImage src={patient.avatar || "https://static.vecteezy.com/system/resources/thumbnails/050/056/093/small/a-baby-in-a-blue-knitted-hat-is-smiling-photo.jpeg"} alt={patient.name} />
              <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl font-bold text-black font-display tracking-wide">
            {patient.name.split(' ')[0]}
          </h1>
        </motion.div>

        {/* Link Buttons */}
        <motion.div
          className="space-y-4 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {linkButtons.map((button, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Button
                asChild
                className={cn(
                  "w-full py-6 rounded-full text-lg font-medium text-white justify-between group",
                  button.color
                )}
              >
                <Link to={button.link}>
                  <span className="flex items-center">
                    <button.icon className="h-5 w-5 mr-3" />
                    {button.label}
                  </span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div
            // to="/"
            className="inline-flex items-center text-xl font-bold text-escalando-700 hover:text-escalando-900 transition-colors"
          >
            ESCALANDO
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientLinks;
