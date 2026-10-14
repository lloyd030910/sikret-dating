import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  providers: [PhotosService, S3Service],
  controllers: [PhotosController],
  exports: [PhotosService],
})
export class PhotosModule {}
