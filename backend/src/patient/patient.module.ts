import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient } from './entities/patient.entity';
import { PatientContact } from './entities/patient-contact.entity';
import { PatientContactService } from './patient-contact.service';
import { PatientContactController } from './patient-contact.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, PatientContact])],
  controllers: [PatientController, PatientContactController],
  providers: [PatientService, PatientContactService],
  exports: [PatientService, PatientContactService],
})
export class PatientModule {}
