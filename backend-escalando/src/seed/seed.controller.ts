import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}


  @Get()
  executeSeed() {
    return this.seedService.runSeed();
  }

  // @Get('users')
  // executeUsersSeed() {
  //   return this.seedService.runUsersSeed();
  // }

  // @Get('patients')
  // executePatientsSeed() {
  //   return this.seedService.runPatientsSeed();
  // }

  // @Get('professionals')
  // executeProfessionalsSeed() {
  //   return this.seedService.runProfessionalsSeed();
  // }

  // @Get('all')
  // executeAllSeed() {
  //   return this.seedService.runAllSeed();
  // }

}
