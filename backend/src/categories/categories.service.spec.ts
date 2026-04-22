import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

// Fake PrismaService — we don't want real DB calls in unit tests
const mockPrisma = {
  category: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks(); // Reset mock state between tests
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);
      mockPrisma.category.create.mockResolvedValue({
        id: 'uuid-1',
        name: 'Skincare',
        description: 'All skincare',
      });

      const result = await service.create({
        name: 'Skincare',
        description: 'All skincare',
      });

      expect(result.name).toBe('Skincare');
    });

    it('should throw ConflictException if name already exists', async () => {
      mockPrisma.category.findFirst.mockResolvedValue({ id: 'uuid-1' });

      await expect(
        service.create({ name: 'Skincare' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({
        id: 'uuid-1',
        name: 'Skincare',
      });

      const result = await service.findOne('uuid-1');
      expect(result.id).toBe('uuid-1');
    });

    it('should throw NotFoundException if category does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if category does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(
        service.update('bad-id', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update successfully', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'uuid-1' });
      mockPrisma.category.findFirst.mockResolvedValue(null);
      mockPrisma.category.update.mockResolvedValue({
        id: 'uuid-1',
        name: 'New Name',
      });

      const result = await service.update('uuid-1', { name: 'New Name' });
      expect(result.name).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'uuid-1' });
      mockPrisma.category.delete.mockResolvedValue({});

      const result = await service.remove('uuid-1');
      expect(result.message).toBe('Category deleted successfully');
    });

    it('should throw NotFoundException if category does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});