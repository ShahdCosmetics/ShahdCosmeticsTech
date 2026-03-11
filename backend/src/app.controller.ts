import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RootResponseDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Handles the root GET request.
   */
  @Get()
  getRootResponse(): RootResponseDto {
    return this.appService.getRootDirMessage();
  }
}