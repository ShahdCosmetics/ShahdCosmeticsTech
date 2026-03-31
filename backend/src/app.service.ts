import { Injectable } from '@nestjs/common';
import { RootResponseDto } from './app.dto';

@Injectable()
export class AppService {
  getRootDirMessage(): RootResponseDto {
  return { message: 'ShahdCosmetics API is running!' };
  }
}