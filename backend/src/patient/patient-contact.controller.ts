import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PatientContactService } from './patient-contact.service';
import { CreatePatientContactDto } from './dto/create-patient-contact.dto';
import { UpdatePatientContactDto } from './dto/update-patient-contact.dto';
import { PatientContact } from './entities/patient-contact.entity';

@Controller('patient-contacts')
export class PatientContactController {
    constructor(private readonly patientContactService: PatientContactService) {}

    @Post()
    create(@Body() createPatientContactDto: CreatePatientContactDto): Promise<PatientContact> {
        return this.patientContactService.create(createPatientContactDto);
    }

    @Get()
    findAll(): Promise<PatientContact[]> {
        return this.patientContactService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<PatientContact> {
        return this.patientContactService.findOne(id);
    }

    @Get('patient/:patientId')
    findByPatientId(@Param('patientId') patientId: string): Promise<PatientContact[]> {
        return this.patientContactService.findByPatientId(patientId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePatientContactDto: UpdatePatientContactDto,
    ): Promise<PatientContact> {
        return this.patientContactService.update(id, updatePatientContactDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.patientContactService.remove(id);
    }
}