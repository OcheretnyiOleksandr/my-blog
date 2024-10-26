import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './post.dto';
import { PostMapper } from './post.mapper';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Post Controller')
@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Get User's Articles" })
  @ApiResponse({
    status: 200,
    description: "User's Articles",
  })
  @ApiQuery({
    description: 'User ID',
    name: 'userId',
    type: 'number',
    required: true,
  })
  @Get('articles')
  async getUsersArticles(@Query('userId') userId: number): Promise<PostDto[]> {
    const articles = await this.postService.getByUserId(userId);

    return articles.map((post) => PostMapper.toDto(post));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create Post' })
  @ApiBody({
    description: 'Post request',
    type: PostDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Create Post',
  })
  @ApiQuery({
    description: 'User ID',
    name: 'userId',
    type: 'number',
    required: true,
  })
  @Post('article')
  async createPost(@Body() payload: PostDto, @Query('userId') userId: number) {
    const post = PostMapper.fromDto(payload);

    await this.postService.create(post, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get Article By ID' })
  @ApiParam({
    description: 'Article',
    name: 'articleId',
  })
  @Get('articles/:articleId')
  async getArticleById(
    @Param('articleId') articleId: number,
  ): Promise<PostDto> {
    const article = await this.postService.getPostById(articleId);

    return PostMapper.toDto(article);
  }
}
