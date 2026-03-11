import { Injectable } from '@nestjs/common';
import { RootResponseDto } from './app.dto';

@Injectable()
export class AppService {
  /**
   * Returns the default API heart-beat message.
   */
  getRootDirMessage(): RootResponseDto {
    return {
      message: 'ShahdCosmetics API is running!',
    };
  }
}