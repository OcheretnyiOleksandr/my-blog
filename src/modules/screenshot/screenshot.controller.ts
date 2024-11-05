import { Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScreenshotService } from './screenshot.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags('Screenshot Controller')
@Controller('/screenshot')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create Screenshot' })
  @ApiResponse({
    status: 200,
    description: 'Article Screenshot',
  })
  @ApiQuery({
    description: 'Article ID',
    name: 'articleId',
  })
  @Post('/create')
  async create(@Req() request: Request, @Query('articleId') articleId: number) {
    await this.screenshotService.createScreenshot(request, articleId);
  }
}
