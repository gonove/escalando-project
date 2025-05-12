import { Injectable } from '@nestjs/common';
import { PatientService } from 'src/patient/patient.service';
import { patientsSeed } from './data/patients-seed';
import { Patient } from 'src/patient/entities/patient.entity';
import { ProfessionalService } from 'src/professional/professional.service';
import { professionalSeeds } from './data/professional.seed';
import { Professional } from 'src/professional/entities/professional.entity';
import { UserService } from 'src/user/user.service';
import { usersSeed } from './data/users.seed';
import { User } from 'src/user/entities/user.entity';
import { ProfessionalPatient } from 'src/professional/entities/professional-patients.entity';
import { PatientContactService } from 'src/patient/patient-contact.service';
import { patientContactsSeed } from './data/pacients-contact.seed';
import { PatientContact } from 'src/patient/entities/patient-contact.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly patientService: PatientService,
    private readonly professionalService: ProfessionalService,
    private readonly userService: UserService,
    private readonly patientContactService: PatientContactService,
  ) {}

  async runSeed() {
    // First delete all relationships
    await this.professionalService.removeAllProfessionalPatients();
    console.log('Professional-Patient relationships deleted');

    // Then delete all entities
    await this.insertNewUsers();
    console.log('Users inserted');
    await this.insertNewPatients();
    console.log('Patients inserted');
    await this.insertNewProfessionals();
    console.log('Professionals inserted');

    // Finally create the relationships
    await this.insertProfessionalPatients();
    console.log('Professional-Patient relationships inserted');

    await this.insertNewPatientContacts();
    console.log('Patient contacts inserted');

    return 'Seed executed';
  }

  private async insertNewUsers() {
    // delete all users
    await this.userService.removeAll();

    const users = usersSeed;

    // insert new users
    const insertPromises: Promise<User | undefined>[] = [];

    users.forEach(user => {
      insertPromises.push(this.userService.create(user));
    });

    await Promise.all(insertPromises);

    return true;
  }

  private async insertNewPatients() {
    // delete all patients
    await this.patientService.removeAll();

    const patients = patientsSeed;

    // insert new patients
    const insertPromises: Promise<Patient | undefined>[] = [];

    patients.forEach(patient => {
      insertPromises.push(this.patientService.create(patient));
    });

    await Promise.all(insertPromises);

    return true;
  }

  private async insertNewProfessionals() {
    // delete all professionals
    await this.professionalService.removeAll();

    const professionals = professionalSeeds;

    const insertPromises: Promise<Professional | undefined>[] = [];

    professionals.forEach(professional => {
      insertPromises.push(this.professionalService.create(professional));
    });

    await Promise.all(insertPromises);

    return true;
  }

  private async insertNewPatientContacts() {
    // delete all patient contacts
    await this.patientContactService.removeAll();

    // Get all patients to map their IDs
    const patients = await this.patientService.findAll({limit: 20, offset: 0});
    if (!patients) {
      throw new Error('Could not find patients');
    }

    // Create a map of patient names to IDs
    const patientMap = new Map(
      patients.map(patient => [patient.fullName, patient.id])
    );

    console.log('Patient map:', patientMap);

    // Prepare contacts with patient IDs
    const contacts = patientContactsSeed.map(contact => {
      // Find the patient by name in the seed data
      console.log('Contact:', contact);
      const patientName = contact.patientId;
      const patientId = patientMap.get(patientName);
      console.log('Patient ID:', patientId);
      if (!patientId) {
        throw new Error(`Could not find patient ID for contact: ${patientName}`);
      }

      return {
        ...contact,
        patientId
      };
    });

    // Insert all contacts
    const insertPromises: Promise<PatientContact>[] = [];
    contacts.forEach(contact => {
      insertPromises.push(this.patientContactService.create(contact));
    });

    await Promise.all(insertPromises);
    return true;
  }

  private async insertProfessionalPatients() {
    // Get all professionals and patients
    const professionals = await this.professionalService.findAll();
    const patients = await this.patientService.findAll({});

    if (!professionals || !patients) {
      throw new Error('Could not find professionals or patients');
    }

    // Create relationships based on specialties and diagnoses
    const insertPromises: Promise<ProfessionalPatient>[] = [];

    for (const professional of professionals) {
      for (const patient of patients) {
        // Create relationships based on matching specialties and diagnoses
        if (
          (professional.specialty === 'Psicología Clínica' &&
           (patient.diagnosis === 'TEA' || patient.diagnosis === 'TDAH' || patient.diagnosis === 'Trastorno de Ansiedad')) ||
          (professional.specialty === 'Psiquiatría' &&
           (patient.diagnosis === 'TDAH' || patient.diagnosis === 'Trastorno de Ansiedad')) ||
          (professional.specialty === 'Psicología Infantil' &&
           (patient.diagnosis === 'TEA' || patient.diagnosis === 'TDAH' || patient.diagnosis === 'Trastorno del Lenguaje' ||
            patient.diagnosis === 'Trastorno Fonológico' || patient.diagnosis === 'Retraso del Desarrollo'))
        ) {
          insertPromises.push(
            this.professionalService.addPatient(
              professional.id,
              patient.id,
            )
          );
        }
      }
    }

    await Promise.all(insertPromises);
    return true;
  }
}
