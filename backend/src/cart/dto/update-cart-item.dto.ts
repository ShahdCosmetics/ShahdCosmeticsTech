import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  // quantity 0 is valid — it signals the service to remove the item entirely
  @IsInt()
  @Min(0)
  quantity: number;
}