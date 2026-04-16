import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: { name: dto.name },
    });

    // Prevent duplicate category names
    if (existing) {
      throw new ConflictException(
        `Category with name "${dto.name}" already exists`,
      );
    }

    return this.prisma.category.create({ data: dto });
  }

  async findAll() {
    return this.prisma.category.findMany({
      select: { id: true, name: true, description: true },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    // Throw early so callers never get a null back
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id); // 404 guard — reuse instead of duplicating the check

    if (dto.name) {
      const nameConflict = await this.prisma.category.findFirst({
        where: { name: dto.name, NOT: { id } },
      });

      if (nameConflict) {
        throw new ConflictException(
          `Category with name "${dto.name}" already exists`,
        );
      }
    }

    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id); // 404 guard

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}