import { CreateUserDto } from "src/user/dto/create-user.dto";

export const usersSeed: CreateUserDto[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'maria.gonzalez@example.com',
    // password: 'password123',
    role: 'professional',
    cognitoSub: '00000000-0000-0000-0000-000000000001',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'carlos.martinez@example.com',
    cognitoSub: '00000000-0000-0000-0000-000000000002',
    // password: 'password123',
    role: 'professional'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'ana.rodriguez@example.com',
    cognitoSub: '00000000-0000-0000-0000-000000000003',
    // password: 'password123',
    role: 'professional'
  }
];