
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  UserCircle,
  FileText,
  Calendar,
  PlusCircle,
  ArrowUpRight,
  Activity
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { professionals, patients, sessions } from "@/data/mockData";

// Get the first professional for demo purposes
const currentProfessional = professionals[1];
const myPatients = patients.filter(
  (patient) => patient.professionalId === currentProfessional.id
);
const recentSessions = sessions
  .filter((session) => session.professionalId === currentProfessional.id)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  description: string;
  color: string;
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium text-gray-700">{title}</CardTitle>
          <div className={`p-2 rounded-full ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const ActionCard = ({
  icon: Icon,
  title,
  description,
  linkTo,
  linkText
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="p-3 rounded-full bg-therapy-100 w-fit">
          <Icon className="h-6 w-6 text-therapy-600" />
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link to={linkTo}>
          <Button variant="outline" className="group">
            {linkText}
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Index = () => {
  const stats = [
    {
      title: "Pacientes Activos",
      value: myPatients.length,
      description: "Pacientes bajo tu cuidado",
      icon: Users,
      color: "bg-therapy-600",
    },
    {
      title: "Sesiones Este Mes",
      value: recentSessions.length,
      description: "Realizadas en los últimos 30 días",
      icon: Calendar,
      color: "bg-therapy-500",
    },
    {
      title: "Evaluaciones Terapeuticas",
      value: "2/3",
      description: "Evaluaciones completadas",
      icon: Activity,
      color: "bg-therapy-400",
    },
  ];

  const actions = [
    {
      title: "Registrar Paciente",
      description: "Añadir un nuevo paciente a tu lista",
      icon: PlusCircle,
      linkTo: "/patients/new",
      linkText: "Nuevo Paciente",
    },
    {
      title: "Programar Sesión",
      description: "Agendar una nueva sesión terapéutica",
      icon: Calendar,
      linkTo: "/sessions/new",
      linkText: "Nueva Sesión",
    },
    {
      title: "Actualizar Perfil",
      description: "Gestionar tu información profesional",
      icon: UserCircle,
      linkTo: "/profile",
      linkText: "Ver Perfil",
    },
    {
      title: "Generar Informe",
      description: "Crear reportes detallados de avance",
      icon: FileText,
      linkTo: "/reports",
      linkText: "Nuevo Informe",
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center mb-6"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img
                src={currentProfessional.avatar}
                alt={currentProfessional.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                Hola, {currentProfessional.name.split(" ")[1]}
              </h1>
              <p className="text-muted-foreground">
                Bienvenido a tu panel de fisioterapia
              </p>
            </div>
          </motion.div>
        </div>

        <section>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium mb-4"
          >
            Resumen
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  icon={stat.icon}
                  color={stat.color}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-medium mb-4"
          >
            Acciones Rápidas
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <ActionCard
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  linkTo={action.linkTo}
                  linkText={action.linkText}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-medium mb-4"
          >
            Sesiones Recientes
          </motion.h2>
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 py-3 px-4 border-b text-sm font-medium text-gray-600">
              <div className="col-span-3">Fecha</div>
              <div className="col-span-3">Paciente</div>
              <div className="col-span-4">Progreso</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>
            {recentSessions.map((session, index) => {
              const patient = patients.find(p => p.id === session.patientId);
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="grid grid-cols-12 py-4 px-4 border-b last:border-0 items-center"
                >
                  <div className="col-span-3 font-medium">
                    {new Date(session.date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="col-span-3">
                    {patient?.name}
                  </div>
                  <div className="col-span-4 truncate text-sm">
                    {session.progress}
                  </div>
                  <div className="col-span-2 text-right">
                    <Link to={`/sessions/${session.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <Link to="/sessions">
              <Button variant="outline">
                Ver Todas las Sesiones
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </motion.div>
    </Layout>
  );
};

export default Index;
