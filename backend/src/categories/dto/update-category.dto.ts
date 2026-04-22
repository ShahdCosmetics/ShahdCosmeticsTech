import { IsString, IsOptional, IsNumber, MaxLength, Min } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  slug?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  level?: number;
}