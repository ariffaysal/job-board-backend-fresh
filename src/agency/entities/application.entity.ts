
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Job } from './job.entity';

export enum ApplicationStatus {
  APPLIED = 'applied',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired',
  WITHDRAWN = 'withdrawn',
  INTERVIEW_SCHEDULED = 'interview-scheduled',
  OFFER_EXTENDED = 'offer-extended'
}

export enum ApplicationSource {
  WEBSITE = 'website',
  LINKEDIN = 'linkedin',
  REFERRAL = 'referral',
  EMAIL = 'email',
  OTHER = 'other'
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  candidateName: string;

  @Column({ length: 255 })
  candidateEmail: string;

  @Column('text', { nullable: true })
  coverLetter?: string;

  @Column({ length: 255, nullable: true })
  resume?: string; // filename stored by multer

  @Column({ 
    type: 'varchar', 
    length: 30,
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED 
  })
  status: ApplicationStatus;

  @Column({ 
    type: 'varchar', 
    length: 20,
    enum: ApplicationSource,
    default: ApplicationSource.WEBSITE 
  })
  source: ApplicationSource;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 100, nullable: true })
  currentJobTitle?: string;

  @Column({ length: 500, nullable: true })
  currentCompany?: string;

  @Column({ length: 1000, nullable: true })
  linkedInProfile?: string;

  @Column({ length: 1000, nullable: true })
  portfolioUrl?: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  yearsOfExperience?: number;

  @Column({ length: 1000, nullable: true })
  expectedSalary?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentSalary?: number;

  @Column({ length: 1000, nullable: true })
  notes?: string;

  @Column({ length: 1000, nullable: true })
  skills?: string;

  @Column({ type: 'json', nullable: true })
  interviewSchedule?: any; // Store interview dates and times

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  jobId: number;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  job: Job;

  @CreateDateColumn()
  appliedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
