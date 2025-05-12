import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Professional } from './professional.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('professional_patients')
export class ProfessionalPatient {
  @PrimaryColumn('uuid')
  professionalId: string;

  @PrimaryColumn('uuid')
  patientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Professional)
  @JoinColumn()
  professional: Professional;

  @ManyToOne(() => Patient)
  @JoinColumn()
  patient: Patient;
}