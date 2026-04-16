import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// Reuses all fields from CreateCategoryDto but makes them optional
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}