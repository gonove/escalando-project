import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('patient_contact')
export class PatientContact {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    patientId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    relationship: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @ManyToOne(() => Patient, (patient) => patient.contacts)
    patient: Patient;
}