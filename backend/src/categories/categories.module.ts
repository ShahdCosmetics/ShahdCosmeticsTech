import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // Products module will need this later
})
export class CategoriesModule {}