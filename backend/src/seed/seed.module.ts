import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PatientModule } from 'src/patient/patient.module';
import { ProfessionalModule } from 'src/professional/professional.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PatientModule, ProfessionalModule, UserModule],
  exports: [SeedService],
})
export class SeedModule {}
