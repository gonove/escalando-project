import { IsDate, IsIn, IsString, MinLength } from 'class-validator';

export class CreateProfessionalDto {
  // @IsString()
  // userId: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  specialty: string;

  @IsString()
  bio: string;

  @IsString()
  @IsIn(['active', 'inactive'])
  status: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
