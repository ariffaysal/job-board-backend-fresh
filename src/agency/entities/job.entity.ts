import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, JoinColumn } from 'typeorm';
import { Client } from './client.entity';
import { Application } from './application.entity';
import { SlugService } from '../../common/services/slug.service';

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  REMOTE = 'remote',
  HYBRID = 'hybrid'
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
  PAUSED = 'paused'
}

export enum JobExperienceLevel {
  ENTRY = 'entry',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive'
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column({ length: 500, nullable: true })
  location?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary?: number;

  @Column({ 
    type: 'varchar', 
    length: 20,
    enum: JobType,
    default: JobType.FULL_TIME 
  })
  type: JobType;

  @Column({ 
    type: 'varchar', 
    length: 20,
    enum: JobStatus,
    default: JobStatus.DRAFT 
  })
  status: JobStatus;

  @Column({ 
    type: 'varchar', 
    length: 20,
    enum: JobExperienceLevel,
    nullable: true 
  })
  experienceLevel?: JobExperienceLevel;

  @Column({ length: 1000, nullable: true })
  requirements?: string;

  @Column({ length: 500, nullable: true })
  department?: string;

  @Column({ length: 1000, nullable: true })
  benefits?: string;

  @Column({ length: 100, nullable: true })
  workSchedule?: string;

  @Column({ length: 1000, nullable: true })
  skills?: string;

  @Column({ default: false })
  isRemote: boolean;

  @Column({ nullable: true })
  clientId: number;

  @ManyToOne(() => Client, (client) => client.jobs, { onDelete: 'CASCADE' })
  @JoinColumn()
  client: Client;

  @OneToMany(() => Application, (application) => application.job, { cascade: true })
  applications: Application[];

  @Column({ length: 160, nullable: true })
  metaDescription?: string;

  @Column({ length: 500, nullable: true })
  metaKeywords?: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'date', nullable: true })
  applicationDeadline?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Private instance of SlugService for slug generation
  private static slugService = new SlugService();

  @BeforeInsert()
  async generateSlug() {
    if (!this.slug) {
      const companyName = this.client?.companyName || 'company';
      
      // Generate unique slug
      this.slug = await Job.slugService.generateUniqueSlug(
        this.title,
        companyName,
        async (slug: string) => {
          // This would need to be injected properly in a real implementation
          // For now, we'll use a simple check
          return false; // Placeholder - would check database for existing slug
        }
      );

      // Generate meta description
      this.metaDescription = Job.slugService.generateMetaDescription(this.slug);
      
      // Generate meta keywords
      const keywords = Job.slugService.extractKeywords(this.slug);
      this.metaKeywords = keywords.join(', ');
    }
  }

  @BeforeInsert()
  generateMetaTags() {
    if (!this.metaDescription) {
      this.metaDescription = Job.slugService.generateMetaDescription(this.slug || this.title);
    }
  }
}