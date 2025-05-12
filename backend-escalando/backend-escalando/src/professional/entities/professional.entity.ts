import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('professionals')
export class Professional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ name: 'user_id', type: 'uuid' })
  // userId: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column()
  phone: string;

  @Column()
  specialty: string;

  @Column()
  bio: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @ManyToMany(() => Patient, (patient) => patient.professionals)
  patients: Patient[];
}