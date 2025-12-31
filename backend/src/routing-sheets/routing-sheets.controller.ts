// src/routing-sheets/routing-sheets.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, Patch, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RoutingSheetsService } from './routing-sheets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as CurrentUser } from '../common/decorators/user.decorator';
import { UpdateRoutingSheetDto } from './dto/update-routing-sheet.dto';
import { CreateRoutingSheetDto } from './dto/create-routing-sheet.dto';

@Controller('routing-sheets')
@UseGuards(JwtAuthGuard)
export class RoutingSheetsController {
  constructor(private readonly routingSheetsService: RoutingSheetsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'citeFile', maxCount: 1 }
  ]))
  create(
    @Body() createRoutingSheetDto: CreateRoutingSheetDto, 
    @UploadedFiles() files: { file?: Express.Multer.File, citeFile?: Express.Multer.File },
    @CurrentUser() user: any
  ) {
    const file = files?.file?.[0];
    const citeFile = files?.citeFile?.[0];
    
    return this.routingSheetsService.create(createRoutingSheetDto, user.userId, file, citeFile);
  }

  @Get()
  findAll() {
    return this.routingSheetsService.findAll();
  }

  @Patch(':id/receive')
  receive(@Param('id') id: string, @CurrentUser() user: any) {
    return this.routingSheetsService.receive(+id, user.userId);
  }

  @Put(':id/process')
  process(
    @Param('id') id: string, 
    @Body() updateRoutingSheetDto: UpdateRoutingSheetDto,
    @CurrentUser() user: any
  ) {
    return this.routingSheetsService.process(+id, user.userId, updateRoutingSheetDto);
  }

  @Put(':id/archive')
  archive(
    @Param('id') id: string, 
    @Body('folderId') folderId: number,
    @CurrentUser() user: any
  ) {
    return this.routingSheetsService.archive(+id, user.userId, folderId);
  }

  @Get('pending')
  findPendingByUser(@CurrentUser() user: any) {
    return this.routingSheetsService.findPendingByUser(user.userId);
  }

  @Get('unreceived')
  findUnreceivedPendingByUser(@CurrentUser() user: any) {
    return this.routingSheetsService.findUnreceivedPendingByUser(user.userId);
  }

  @Get('sent/unreceived')
  findUnreceivedSentByUser(@CurrentUser() user: any) {
    return this.routingSheetsService.findUnreceivedSentByUser(user.userId);
  }

  @Get('sent')
  findSentByUser(@CurrentUser() user: any) {
    return this.routingSheetsService.findSentByUser(user.userId);
  }

  @Get('received')
  findReceivedByUser(@CurrentUser() user: any) {
    return this.routingSheetsService.findReceivedByUser(user.userId);
  }

  @Get('archived')
  findArchivedByUser(@CurrentUser() user: any) {
    return this.routingSheetsService.findArchivedByUser(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routingSheetsService.findOne(+id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.routingSheetsService.cancel(+id, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routingSheetsService.remove(+id);
  }
}