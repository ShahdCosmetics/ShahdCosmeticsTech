import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug: string;

  @IsNumber()
  @Min(1)
  level: number;
}