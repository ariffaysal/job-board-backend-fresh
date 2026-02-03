import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ParseIntPipe,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AgencyService } from './agency.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from './utils/fileUpload';
import { AgencyValidationPipe } from './pipes/agency-validation.pipe';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { LoginDto } from './dto/login.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  // ========== PUBLIC ROUTES (No authentication needed) ==========

  @Post()
  @UsePipes(new AgencyValidationPipe())
  createAgency(@Body() dto: CreateAgencyDto) {
    return this.agencyService.createAgency(dto);
  }

  @Post('login')
  @UsePipes(new AgencyValidationPipe())
  login(@Body() dto: LoginDto) {
    return this.agencyService.login(dto);
  }

  @Get()
  getAllAgencies() {
    return this.agencyService.getAllAgencies();
  }

  @Get(':id')
  getAgency(@Param('id', ParseIntPipe) id: number) {
    return this.agencyService.getAgencyById(id);
  }

  @Get(':id/clients')
  getClients(@Param('id', ParseIntPipe) agencyId: number) {
    return this.agencyService.getClientsByAgency(agencyId);
  }

  @Get('client/:clientId/jobs')
  getJobs(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.agencyService.getJobsByClient(clientId);
  }

  @Post('job/:jobId/apply')
  @UseInterceptors(FileInterceptor('resume', fileUploadOptions))
  @UsePipes(new AgencyValidationPipe())
  applyToJob(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() dto: CreateApplicationDto,
    @UploadedFile() resume?: Express.Multer.File,
  ) {
    return this.agencyService.applyToJob(jobId, dto, resume);
  }

  // ========== PROTECTED ROUTES (Authentication required) ==========

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new AgencyValidationPipe())
  updateAgency(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAgencyDto) {
    return this.agencyService.updateAgency(id, dto);
  }

  //@Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteAgency(@Param('id', ParseIntPipe) id: number) {
    return this.agencyService.deleteAgency(id);
  }

  @Post(':id/client')
 // @UseGuards(JwtAuthGuard)
  @UsePipes(new AgencyValidationPipe())
  addClient(@Param('id', ParseIntPipe) agencyId: number, @Body() dto: CreateClientDto) {
    return this.agencyService.addClient(agencyId, dto);
  }

  @Post('client/:clientId/job')
 // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  @UsePipes(new AgencyValidationPipe())
  addJob(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() dto: CreateJobDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.agencyService.addJob(clientId, dto, file);
  }

  @Delete('job/:jobId')
//  @UseGuards(JwtAuthGuard)
  deleteJob(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.agencyService.deleteJob(jobId);
  }

  @Get('job/:jobId/applications')
  //@UseGuards(JwtAuthGuard)
  getApplications(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.agencyService.getApplicationsByJob(jobId);
  }

  
@Get('job/:id')
getJob(@Param('id') id: string) {
  const jobId = Number(id);
  if (isNaN(jobId)) throw new BadRequestException('Job ID must be a number');
  return this.agencyService.getJobById(jobId);
}




  @Patch('application/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new AgencyValidationPipe())
  updateApplication(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateApplicationDto) {
    return this.agencyService.updateApplication(id, dto);
  }

  @Delete('application/:id')
  @UseGuards(JwtAuthGuard)
  deleteApplication(@Param('id', ParseIntPipe) id: number) {
    return this.agencyService.deleteApplication(id);
  }
}