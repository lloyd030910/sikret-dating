import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PhotosService } from './photos.service';
import { S3Service } from './s3.service';

@ApiTags('Photos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('photos')
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a profile photo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        isMain: { type: 'boolean', default: false },
      },
    },
  })
  async uploadPhoto(
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    ) file: Express.Multer.File,
    @Body('isMain') isMain: string,
  ) {
    const key = `users/${req.user.id}/photos/${Date.now()}-${file.originalname}`;
    const photoUrl = await this.s3Service.uploadFile(file, key);

    return this.photosService.create(req.user, {
      url: photoUrl,
      storageKey: key,
      isMain: isMain === 'true',
      mimeType: file.mimetype,
      fileSize: file.size,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a photo' })
  async deletePhoto(@Req() req, @Param('id') id: string) {
    return this.photosService.delete(id, req.user.id);
  }

  @Post(':id/main')
  @ApiOperation({ summary: 'Set photo as main' })
  async setMain(@Req() req, @Param('id') id: string) {
    return this.photosService.setMain(id, req.user.id);
  }
}
