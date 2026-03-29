import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('products') // Bu satır localhost:3000/products yolunu açar
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  // @Get()
  // async getProducts() {
  //   // Veritabanındaki tüm ürünleri getirir
  //   return this.prisma.product.findMany();
  // }
  @Get()
  getHello(): string {
    return 'API is running safely!';
  }
}