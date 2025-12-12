// src/documents/documents.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as CurrentUser } from '../common/decorators/user.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload/cite/:citeId')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocumentToCite(
    @Param('citeId') citeId: string,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.uploadDocumentToCite(+citeId, user.userId, file);
  }

  @Post('upload/routing-sheet/:routingSheetId')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocumentToRoutingSheet(
    @Param('routingSheetId') routingSheetId: string,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.uploadDocumentToRoutingSheet(+routingSheetId, user.userId, file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
}