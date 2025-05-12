import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository, IsNull } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PatientContact } from './entities/patient-contact.entity';
@Injectable()
export class PatientService {
  private readonly logger = new Logger('PatientService');
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(PatientContact)
    private readonly patientContactRepository: Repository<PatientContact>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    try {
      const patient = this.patientRepository.create(createPatientDto);

      await this.patientRepository.save(patient);
      return patient;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const patients = await this.patientRepository.find({
        take: limit,
        skip: offset,
        where: { deletedAt: IsNull() },
      });
      if (!patients) {
        throw new Error('Patients not found');
      }

      return patients;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOne(id: string) {
    try {
      const patient = await this.patientRepository.findOneBy({ id });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const contacts = await this.patientContactRepository.findBy({ patientId: id });
      if (!contacts) {
        throw new NotFoundException('Contacts not found');
      }

      patient.contacts = contacts;
      return patient;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    try {
      return await this.patientRepository.update(id, updatePatientDto);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async remove(id: string) {
    try {
      const patient = await this.patientRepository.findOneBy({ id });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      await this.patientRepository.update(id, { deletedAt: new Date() });

      return patient;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async removeAll() {
    try {
      await this.patientRepository.query('TRUNCATE TABLE "patient" CASCADE');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
