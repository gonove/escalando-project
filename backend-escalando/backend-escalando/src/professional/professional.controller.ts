import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { Professional } from './entities/professional.entity';
import { ProfessionalPatient } from './entities/professional-patients.entity';

@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  create(@Body() createProfessionalDto: Partial<Professional>) {
    return this.professionalService.create(createProfessionalDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfessionalDto: Partial<Professional>) {
    return this.professionalService.update(id, updateProfessionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionalService.remove(id);
  }

  @Post(':id/patients/:patientId')
  addPatient(
    @Param('id') id: string,
    @Param('patientId') patientId: string
  ) {
    return this.professionalService.addPatient(id, patientId);
  }

  @Delete(':id/patients/:patientId')
  removePatient(@Param('id') id: string, @Param('patientId') patientId: string) {
    return this.professionalService.removePatient(id, patientId);
  }

  @Get(':id/patients')
  getPatients(@Param('id') id: string) {
    return this.professionalService.getPatients(id);
  }
}