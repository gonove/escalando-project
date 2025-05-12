import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientContactDto } from './create-patient-contact.dto';

export class UpdatePatientContactDto extends PartialType(CreatePatientContactDto) {}