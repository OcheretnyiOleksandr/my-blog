import { Controller, Get, Post, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LikeDto } from './like.dto';

@ApiTags('Like Controller')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: 'Create Like' })
  @ApiResponse({
    status: 200,
    description: 'Create Like',
  })
  @ApiQuery({
    description: 'User ID',
    name: 'userId',
    type: 'number',
    required: true,
  })
  @ApiQuery({
    description: 'Article ID',
    name: 'articleId',
    type: 'number',
    required: true,
  })
  @Post('like')
  async like(
    @Query('userId') userId: number,
    @Query('articleId') articleId: number,
  ): Promise<void> {
    await this.likeService.like(userId, articleId);
  }

  @ApiOperation({ summary: 'Unlike' })
  @ApiResponse({
    status: 200,
    description: 'Unlike',
  })
  @ApiQuery({
    description: 'User ID',
    name: 'userId',
    type: 'number',
    required: true,
  })
  @ApiQuery({
    description: 'Article ID',
    name: 'articleId',
    type: 'number',
    required: true,
  })
  @Post('unlike')
  async unlike(
    @Query('userId') userId: number,
    @Query('articleId') articleId: number,
  ): Promise<void> {
    await this.likeService.unlike(userId, articleId);
  }

  @ApiOperation({ summary: 'Get Like Count' })
  @ApiResponse({
    status: 200,
    description: 'Get Like Count',
  })
  @ApiQuery({
    description: 'Article ID',
    name: 'articleId',
    type: 'number',
    required: true,
  })
  @Get()
  async getLikeCount(@Query('articleId') articleId: number): Promise<LikeDto> {
    const like = await this.likeService.countLikes(articleId);

    return new LikeDto(like);
  }
}
