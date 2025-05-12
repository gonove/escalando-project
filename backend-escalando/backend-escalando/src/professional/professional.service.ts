import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './entities/professional.entity';
import { ProfessionalPatient } from './entities/professional-patients.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    @InjectRepository(ProfessionalPatient)
    private readonly professionalPatientRepository: Repository<ProfessionalPatient>,
    private readonly userService: UserService,
  ) {}

  async create(professionalData: Partial<Professional>): Promise<Professional> {
    const professional = this.professionalRepository.create(professionalData);
    return this.professionalRepository.save(professional);
  }

  async findAll(): Promise<Professional[]> {
    return this.professionalRepository.find();
  }

  async findOne(id: string): Promise<Professional> {
    const professional = await this.professionalRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!professional) {
      throw new Error('Professional not found');
    }

    return professional;
  }

  async update(id: string, professionalData: Partial<Professional>): Promise<Professional> {
    await this.professionalRepository.update(id, professionalData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.professionalRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.professionalRepository.delete({});
  }

  async removeAllProfessionalPatients(): Promise<void> {
    await this.professionalPatientRepository.delete({});
  }

  async addPatient(professionalId: string, patientId: string): Promise<ProfessionalPatient> {
    const professionalPatient = this.professionalPatientRepository.create({
      professionalId,
      patientId,
    });
    return this.professionalPatientRepository.save(professionalPatient);
  }

  async removePatient(professionalId: string, patientId: string): Promise<void> {
    await this.professionalPatientRepository.delete({
      professionalId,
      patientId,
    });
  }

  async getPatients(professionalId: string): Promise<ProfessionalPatient[]> {
    return this.professionalPatientRepository.find({
      where: { professionalId },
      relations: ['patient'],
    });
  }
}