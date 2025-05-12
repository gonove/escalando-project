import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  diagnosis: string;

  @IsString()
  @IsIn(['activo', 'alta', 'baja'])
  patientStatus: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateOfBirth: Date;

  @IsString()
  @MinLength(2)
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsIn(['male', 'female', 'other'])
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  parentName: string;

  @IsString()
  @IsOptional()
  contactNumber: string;
}
