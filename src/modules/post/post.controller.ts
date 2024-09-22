import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './post.dto';
import { PostMapper } from './post.mapper';

@ApiTags('Post Controller')
@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: "Get User's Articles" })
  @ApiResponse({
    status: 200,
    description: "User's Articles",
  })
  @ApiParam({
    description: 'User ID',
    name: 'userId',
  })
  @Get('user/:userId/articles')
  async getUsersArticles(@Param('userId') userId: number): Promise<PostDto[]> {
    const articles = await this.postService.getByUserId(userId);

    return articles.map((post) => PostMapper.toDto(post));
  }

  @ApiOperation({ summary: 'Create Post' })
  @ApiBody({
    description: 'Post request',
    type: PostDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Create Post',
  })
  @ApiParam({
    description: 'User ID',
    name: 'userId',
  })
  @Post('user/:userId/article')
  async createPost(@Body() payload: PostDto, @Param('userId') userId: number) {
    const post = PostMapper.fromDto(payload);

    await this.postService.createPost(post, userId);
  }
}
