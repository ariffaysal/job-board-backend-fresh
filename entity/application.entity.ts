import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Job } from './job.entity';

export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'hired';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  candidateName: string;

  @Column()
  candidateEmail: string;

  @Column('text', { nullable: true })
  coverLetter?: string;

  @Column({ nullable: true })
  resume?: string; // filename stored by multer

  @Column({ type: 'varchar', default: 'applied' })
  status: ApplicationStatus;

  @CreateDateColumn()
  appliedAt: Date;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  job: Job;
}
