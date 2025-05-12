import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { ProfessionalModule } from './professional/professional.module';
import { SeedModule } from './seed/seed.module';
import { dataSourceOptions } from './config/data-source';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot(dataSourceOptions),

    PatientModule,
    ProfessionalModule,
    CommonModule,
    UserModule,
    SeedModule,
  ],
})
export class AppModule {}
