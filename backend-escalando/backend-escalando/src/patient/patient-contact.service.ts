import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientContact } from './entities/patient-contact.entity';
import { CreatePatientContactDto } from './dto/create-patient-contact.dto';
import { UpdatePatientContactDto } from './dto/update-patient-contact.dto';

@Injectable()
export class PatientContactService {
    constructor(
        @InjectRepository(PatientContact)
        private patientContactRepository: Repository<PatientContact>,
    ) {}

    async create(createPatientContactDto: CreatePatientContactDto): Promise<PatientContact> {
        const contact = this.patientContactRepository.create(createPatientContactDto);
        return await this.patientContactRepository.save(contact);
    }

    async findAll(): Promise<PatientContact[]> {
        return await this.patientContactRepository.find();
    }

    async findOne(id: string): Promise<PatientContact> {
        const contact = await this.patientContactRepository.findOne({ where: { id } });
        if (!contact) {
            throw new NotFoundException(`Contact with ID ${id} not found`);
        }
        return contact;
    }

    async findByPatientId(patientId: string): Promise<PatientContact[]> {
        return await this.patientContactRepository.find({ where: { patientId } });
    }

    async update(id: string, updatePatientContactDto: UpdatePatientContactDto): Promise<PatientContact> {
        const contact = await this.findOne(id);
        Object.assign(contact, updatePatientContactDto);
        return await this.patientContactRepository.save(contact);
    }

    async remove(id: string): Promise<void> {
        const contact = await this.findOne(id);
        await this.patientContactRepository.remove(contact);
    }

    async removeAll(): Promise<void> {
        await this.patientContactRepository.clear();
    }
}