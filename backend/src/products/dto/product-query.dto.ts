import { IsOptional, IsInt, IsUUID, IsString, IsIn, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  // UUID string to match the existing categoryId convention in this codebase
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  // Restrict sortBy to known DB fields only — prevents arbitrary column injection
  @IsOptional()
  @IsIn(['basePrice', 'createdAt'])
  sortBy: 'basePrice' | 'createdAt' = 'createdAt';

  // Defaults to desc so the storefront shows newest arrivals first out of the box
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';
}