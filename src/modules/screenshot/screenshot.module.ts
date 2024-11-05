import { Module } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';
import { ScreenshotController } from './screenshot.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [ScreenshotService],
  providers: [ScreenshotService],
  controllers: [ScreenshotController],
})
export class ScreenshotModule {}
