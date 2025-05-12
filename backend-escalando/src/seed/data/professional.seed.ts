import { CreateProfessionalDto } from "src/professional/dto/create-professional";


export const professionalSeeds: CreateProfessionalDto[] = [
  {
    // userId: '00000000-0000-0000-0000-000000000001',
    firstName: 'Dr. María',
    lastName: 'González',
    phone: '+34 612 345 678',
    specialty: 'Psicología Clínica',
    bio: 'Psicóloga clínica especializada en terapia cognitivo-conductual con más de 10 años de experiencia. Me apasiona ayudar a las personas a superar sus desafíos emocionales y mejorar su bienestar mental.',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),

  },
  {
    // userId: '00000000-0000-0000-0000-000000000002',
    firstName: 'Dr. Carlos',
    lastName: 'Martínez',
    phone: '+34 623 456 789',
    specialty: 'Psiquiatría',
    bio: 'Psiquiatra con amplia experiencia en el tratamiento de trastornos del estado de ánimo y ansiedad. Comprometido con proporcionar atención integral y personalizada a cada paciente.',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    // userId: '00000000-0000-0000-0000-000000000003',
    firstName: 'Dra. Ana',
    lastName: 'Rodríguez',
    phone: '+34 634 567 890',
    specialty: 'Psicología Infantil',
    bio: 'Especialista en psicología infantil y juvenil, con enfoque en el desarrollo emocional y social. Experiencia en terapia familiar y manejo de conductas disruptivas.',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];