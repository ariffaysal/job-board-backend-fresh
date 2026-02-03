import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Agency } from './agency.entity';
import { Job } from './job.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  email?: string;

  @ManyToOne(() => Agency, (agency) => agency.clients, { onDelete: 'CASCADE' })
  agency: Agency;

  @OneToMany(() => Job, (job) => job.client, { cascade: true })
  jobs: Job[];
}
