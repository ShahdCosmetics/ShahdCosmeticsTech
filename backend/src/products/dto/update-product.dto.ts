import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Reuses all fields from CreateProductDto but makes them optional
export class UpdateProductDto extends PartialType(CreateProductDto) {}