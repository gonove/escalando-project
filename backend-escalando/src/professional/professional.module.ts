import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity';
import { ProfessionalPatient } from './entities/professional-patients.entity';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Professional, ProfessionalPatient]),
    UserModule,
  ],
  providers: [ProfessionalService],
  controllers: [ProfessionalController],
  exports: [ProfessionalService, TypeOrmModule],
})
export class ProfessionalModule {}