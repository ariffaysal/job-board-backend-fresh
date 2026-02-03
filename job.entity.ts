import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { Application } from './application.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  attachment?: string;

  @ManyToOne(() => Client, (client) => client.jobs, { onDelete: 'CASCADE' })
  client: Client;

  @OneToMany(() => Application, (application) => application.job, { cascade: true })
  applications: Application[];
  location: any;
  salary: any;
  createdAt: any;
}
