import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelProfile } from './entities/model-profile.entity';
import { Assignment } from './entities/assignment.entity';
import { User } from '../users/entities/user.entity';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ModelProfile, Assignment, User])],
  providers: [ModelsService],
  controllers: [ModelsController],
  exports: [ModelsService],
})
export class ModelsModule {}
