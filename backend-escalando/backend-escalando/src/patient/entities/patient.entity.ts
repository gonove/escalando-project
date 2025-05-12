import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';
import { Professional } from '../../professional/entities/professional.entity';
import { PatientContact } from './patient-contact.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column({
    type: 'text',
    generatedType: 'STORED',
    asExpression: `"firstName" || ' ' || "lastName"`,
  })
  fullName: string;

  @Column('text')
  patientStatus: string;

  @Column('text')
  diagnosis: string;

  @Column('date')
  dateOfBirth: Date;

  @Column('text')
  parentName: string;

  @Column('text')
  contactNumber: string;

  @Column('text')
  gender: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // Relaciones
  @OneToMany(() => PatientContact, (patientContact) => patientContact.patient)
  contacts: PatientContact[];

  @ManyToMany(() => Professional)
  @JoinTable({
    name: 'professional_patients',
    joinColumn: {
      name: 'patientId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'professionalId',
      referencedColumnName: 'id',
    },
  })
  professionals: Professional[];

  //   @OneToMany(() => InitialEvaluation, (initialEvaluation) => initialEvaluation.patient)
  //   initialEvaluations: InitialEvaluation[];

  //   @OneToMany(() => Session, (session) => session.patient)
  //   sessions: Session[];

  //   @OneToMany(() => Report, (report) => report.patient)
  //   reports: Report[];
}
