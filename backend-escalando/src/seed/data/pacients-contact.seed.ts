import { CreatePatientContactDto } from "src/patient/dto/create-patient-contact.dto";

export const patientContactsSeed: CreatePatientContactDto[] = [
  // Juan Pérez's contacts
  {
    patientId: "Juan Pérez",
    firstName: "María",
    lastName: "Pérez",
    relationship: "parent",
    phone: "+56912345678",
    email: "maria.perez@gmail.com"
  },
  {
    patientId: "Juan Pérez",
    firstName: "Carlos",
    lastName: "Pérez",
    relationship: "parent",
    phone: "+56912345679",
    email: "carlos.perez@gmail.com"
  },
  {
    patientId: "Juan Pérez",
    firstName: "Ana",
    lastName: "González",
    relationship: "emergency",
    phone: "+56912345670",
    email: "ana.gonzalez@gmail.com"
  },

  // Ana González's contacts
  {
    patientId: "Ana González",
    firstName: "Carlos",
    lastName: "González",
    relationship: "parent",
    phone: "+56987654321",
    email: "carlos.gonzalez@gmail.com"
  },
  {
    patientId: "Ana González",
    firstName: "María",
    lastName: "González",
    relationship: "parent",
    phone: "+56987654322",
    email: "maria.gonzalez@gmail.com"
  },
  {
    patientId: "Ana González",
    firstName: "Roberto",
    lastName: "González",
    relationship: "emergency",
    phone: "+56987654323",
    email: "roberto.gonzalez@gmail.com"
  },

  // Lucas Martínez's contacts
  {
    patientId: "Lucas Martínez",
    firstName: "Laura",
    lastName: "Martínez",
    relationship: "parent",
    phone: "+56923456789",
    email: "laura.martinez@gmail.com"
  },
  {
    patientId: "Lucas Martínez",
    firstName: "Juan",
    lastName: "Martínez",
    relationship: "parent",
    phone: "+56923456780",
    email: "juan.martinez@gmail.com"
  },
  {
    patientId: "Lucas Martínez",
    firstName: "Sofía",
    lastName: "Martínez",
    relationship: "emergency",
    phone: "+56923456781",
    email: "sofia.martinez@gmail.com"
  },

  // Sofía Rodríguez's contacts
  {
    patientId: "Sofía Rodríguez",
    firstName: "Pedro",
    lastName: "Rodríguez",
    relationship: "parent",
    phone: "+56934567890",
    email: "pedro.rodriguez@gmail.com"
  },
  {
    patientId: "Sofía Rodríguez",
    firstName: "Carmen",
    lastName: "Rodríguez",
    relationship: "parent",
    phone: "+56934567891",
    email: "carmen.rodriguez@gmail.com"
  },
  {
    patientId: "Sofía Rodríguez",
    firstName: "Miguel",
    lastName: "Rodríguez",
    relationship: "emergency",
    phone: "+56934567892",
    email: "miguel.rodriguez@gmail.com"
  },

  // Matías Sánchez's contacts
  {
    patientId: "Matías Sánchez",
    firstName: "Carmen",
    lastName: "Sánchez",
    relationship: "parent",
    phone: "+56945678901",
    email: "carmen.sanchez@gmail.com"
  },
  {
    patientId: "Matías Sánchez",
    firstName: "José",
    lastName: "Sánchez",
    relationship: "parent",
    phone: "+56945678902",
    email: "jose.sanchez@gmail.com"
  },
  {
    patientId: "Matías Sánchez",
    firstName: "Isabel",
    lastName: "Sánchez",
    relationship: "emergency",
    phone: "+56945678903",
    email: "isabel.sanchez@gmail.com"
  },

  // Martín Silva's contacts
  {
    patientId: "Martín Silva",
    firstName: "Sofía",
    lastName: "Silva",
    relationship: "parent",
    phone: "+595981234567",
    email: "sofia.silva@gmail.com"
  },
  {
    patientId: "Martín Silva",
    firstName: "Roberto",
    lastName: "Silva",
    relationship: "parent",
    phone: "+595981234568",
    email: "roberto.silva@gmail.com"
  },
  {
    patientId: "Martín Silva",
    firstName: "Ana",
    lastName: "Silva",
    relationship: "emergency",
    phone: "+595981234569",
    email: "ana.silva@gmail.com"
  },

  // Gabriela Martínez's contacts
  {
    patientId: "Gabriela Martínez",
    firstName: "Roberto",
    lastName: "Martínez",
    relationship: "parent",
    phone: "+595971234568",
    email: "roberto.martinez@gmail.com"
  },
  {
    patientId: "Gabriela Martínez",
    firstName: "Laura",
    lastName: "Martínez",
    relationship: "parent",
    phone: "+595971234569",
    email: "laura.martinez@gmail.com"
  },
  {
    patientId: "Gabriela Martínez",
    firstName: "Carlos",
    lastName: "Martínez",
    relationship: "emergency",
    phone: "+595971234570",
    email: "carlos.martinez@gmail.com"
  },

  // Diego Benítez's contacts
  {
    patientId: "Diego Benítez",
    firstName: "Laura",
    lastName: "Benítez",
    relationship: "parent",
    phone: "+595981567890",
    email: "laura.benitez@gmail.com"
  },
  {
    patientId: "Diego Benítez",
    firstName: "Miguel",
    lastName: "Benítez",
    relationship: "parent",
    phone: "+595981567891",
    email: "miguel.benitez@gmail.com"
  },
  {
    patientId: "Diego Benítez",
    firstName: "Sofía",
    lastName: "Benítez",
    relationship: "emergency",
    phone: "+595981567892",
    email: "sofia.benitez@gmail.com"
  },

  // Valentina Giménez's contacts
  {
    patientId: "Valentina Giménez",
    firstName: "Eduardo",
    lastName: "Giménez",
    relationship: "parent",
    phone: "+595972345678",
    email: "eduardo.gimenez@gmail.com"
  },
  {
    patientId: "Valentina Giménez",
    firstName: "María",
    lastName: "Giménez",
    relationship: "parent",
    phone: "+595972345679",
    email: "maria.gimenez@gmail.com"
  },
  {
    patientId: "Valentina Giménez",
    firstName: "Roberto",
    lastName: "Giménez",
    relationship: "emergency",
    phone: "+595972345680",
    email: "roberto.gimenez@gmail.com"
  },

  // Matías Rojas's contacts
  {
    patientId: "Matías Rojas",
    firstName: "Patricia",
    lastName: "Rojas",
    relationship: "parent",
    phone: "+595983456789",
    email: "patricia.rojas@gmail.com"
  },
  {
    patientId: "Matías Rojas",
    firstName: "Juan",
    lastName: "Rojas",
    relationship: "parent",
    phone: "+595983456790",
    email: "juan.rojas@gmail.com"
  },
  {
    patientId: "Matías Rojas",
    firstName: "Laura",
    lastName: "Rojas",
    relationship: "emergency",
    phone: "+595983456791",
    email: "laura.rojas@gmail.com"
  },

  // Camila Fernández's contacts
  {
    patientId: "Camila Fernández",
    firstName: "Miguel",
    lastName: "Fernández",
    relationship: "parent",
    phone: "+595984567890",
    email: "miguel.fernandez@gmail.com"
  },
  {
    patientId: "Camila Fernández",
    firstName: "Ana",
    lastName: "Fernández",
    relationship: "parent",
    phone: "+595984567891",
    email: "ana.fernandez@gmail.com"
  },
  {
    patientId: "Camila Fernández",
    firstName: "Carlos",
    lastName: "Fernández",
    relationship: "emergency",
    phone: "+595984567892",
    email: "carlos.fernandez@gmail.com"
  },

  // Joaquín Acosta's contacts
  {
    patientId: "Joaquín Acosta",
    firstName: "Ana",
    lastName: "Acosta",
    relationship: "parent",
    phone: "+595975678901",
    email: "ana.acosta@gmail.com"
  },
  {
    patientId: "Joaquín Acosta",
    firstName: "Roberto",
    lastName: "Acosta",
    relationship: "parent",
    phone: "+595975678902",
    email: "roberto.acosta@gmail.com"
  },
  {
    patientId: "Joaquín Acosta",
    firstName: "María",
    lastName: "Acosta",
    relationship: "emergency",
    phone: "+595975678903",
    email: "maria.acosta@gmail.com"
  },

  // Lucía Duarte's contacts
  {
    patientId: "Lucía Duarte",
    firstName: "Jorge",
    lastName: "Duarte",
    relationship: "parent",
    phone: "+595986789012",
    email: "jorge.duarte@gmail.com"
  },
  {
    patientId: "Lucía Duarte",
    firstName: "Laura",
    lastName: "Duarte",
    relationship: "parent",
    phone: "+595986789013",
    email: "laura.duarte@gmail.com"
  },
  {
    patientId: "Lucía Duarte",
    firstName: "Carlos",
    lastName: "Duarte",
    relationship: "emergency",
    phone: "+595986789014",
    email: "carlos.duarte@gmail.com"
  },

  // Tomás Cáceres's contacts
  {
    patientId: "Tomás Cáceres",
    firstName: "Claudia",
    lastName: "Cáceres",
    relationship: "parent",
    phone: "+595987890123",
    email: "claudia.caceres@gmail.com"
  },
  {
    patientId: "Tomás Cáceres",
    firstName: "Miguel",
    lastName: "Cáceres",
    relationship: "parent",
    phone: "+595987890124",
    email: "miguel.caceres@gmail.com"
  },
  {
    patientId: "Tomás Cáceres",
    firstName: "Ana",
    lastName: "Cáceres",
    relationship: "emergency",
    phone: "+595987890125",
    email: "ana.caceres@gmail.com"
  },

  // Sofía Cardozo's contacts
  {
    patientId: "Sofía Cardozo",
    firstName: "Daniel",
    lastName: "Cardozo",
    relationship: "parent",
    phone: "+595978901234",
    email: "daniel.cardozo@gmail.com"
  },
  {
    patientId: "Sofía Cardozo",
    firstName: "Laura",
    lastName: "Cardozo",
    relationship: "parent",
    phone: "+595978901235",
    email: "laura.cardozo@gmail.com"
  },
  {
    patientId: "Sofía Cardozo",
    firstName: "Roberto",
    lastName: "Cardozo",
    relationship: "emergency",
    phone: "+595978901236",
    email: "roberto.cardozo@gmail.com"
  },

  // Ignacio Velázquez's contacts
  {
    patientId: "Ignacio Velázquez",
    firstName: "Marcela",
    lastName: "Velázquez",
    relationship: "parent",
    phone: "+595989012345",
    email: "marcela.velazquez@gmail.com"
  },
  {
    patientId: "Ignacio Velázquez",
    firstName: "Carlos",
    lastName: "Velázquez",
    relationship: "parent",
    phone: "+595989012346",
    email: "carlos.velazquez@gmail.com"
  },
  {
    patientId: "Ignacio Velázquez",
    firstName: "Ana",
    lastName: "Velázquez",
    relationship: "emergency",
    phone: "+595989012347",
    email: "ana.velazquez@gmail.com"
  },

  // Isabella Gómez's contacts
  {
    patientId: "Isabella Gómez",
    firstName: "Fernando",
    lastName: "Gómez",
    relationship: "parent",
    phone: "+595990123456",
    email: "fernando.gomez@gmail.com"
  },
  {
    patientId: "Isabella Gómez",
    firstName: "Laura",
    lastName: "Gómez",
    relationship: "parent",
    phone: "+595990123457",
    email: "laura.gomez@gmail.com"
  },
  {
    patientId: "Isabella Gómez",
    firstName: "Miguel",
    lastName: "Gómez",
    relationship: "emergency",
    phone: "+595990123458",
    email: "miguel.gomez@gmail.com"
  },

  // Sebastián Mendoza's contacts
  {
    patientId: "Sebastián Mendoza",
    firstName: "Lucía",
    lastName: "Mendoza",
    relationship: "parent",
    phone: "+595991234567",
    email: "lucia.mendoza@gmail.com"
  },
  {
    patientId: "Sebastián Mendoza",
    firstName: "Carlos",
    lastName: "Mendoza",
    relationship: "parent",
    phone: "+595991234568",
    email: "carlos.mendoza@gmail.com"
  },
  {
    patientId: "Sebastián Mendoza",
    firstName: "Ana",
    lastName: "Mendoza",
    relationship: "emergency",
    phone: "+595991234569",
    email: "ana.mendoza@gmail.com"
  },

  // Valeria Núñez's contacts
  {
    patientId: "Valeria Núñez",
    firstName: "Pablo",
    lastName: "Núñez",
    relationship: "parent",
    phone: "+595992345678",
    email: "pablo.nunez@gmail.com"
  },
  {
    patientId: "Valeria Núñez",
    firstName: "Laura",
    lastName: "Núñez",
    relationship: "parent",
    phone: "+595992345679",
    email: "laura.nunez@gmail.com"
  },
  {
    patientId: "Valeria Núñez",
    firstName: "Miguel",
    lastName: "Núñez",
    relationship: "emergency",
    phone: "+595992345680",
    email: "miguel.nunez@gmail.com"
  },

  // Nicolás Salinas's contacts
  {
    patientId: "Nicolás Salinas",
    firstName: "Cecilia",
    lastName: "Salinas",
    relationship: "parent",
    phone: "+595993456789",
    email: "cecilia.salinas@gmail.com"
  },
  {
    patientId: "Nicolás Salinas",
    firstName: "Carlos",
    lastName: "Salinas",
    relationship: "parent",
    phone: "+595993456790",
    email: "carlos.salinas@gmail.com"
  },
  {
    patientId: "Nicolás Salinas",
    firstName: "Ana",
    lastName: "Salinas",
    relationship: "emergency",
    phone: "+595993456791",
    email: "ana.salinas@gmail.com"
  }
];
