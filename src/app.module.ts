import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyService } from './agency/agency.service';
import { AuthModule } from './auth/auth.module';
import { AgencyModule } from './agency/agency.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      
      username: 'postgres',
      password: 'mmmm',
      database: 'Agency',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    AgencyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}