import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AgencyModule } from './agency/agency.module';

@Module({
  imports: [
    // Load .env file globally
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        // This reads DATABASE_URL from your Render Environment Variables
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        // Set synchronize to false in a real production app to avoid data loss, 
        // but keeping it true for now as per your requirement.
        synchronize: true, 
        
        // Essential SSL configuration for Render/Managed Postgres
        ssl: {
          rejectUnauthorized: false,
        },
        // Some 'pg' driver versions require SSL to be defined in 'extra'




        /*

        Build Command: ```bash npm install && npm run build

Start Command: ```bash node dist/main.js

        */



        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
    
    AuthModule,
    AgencyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}