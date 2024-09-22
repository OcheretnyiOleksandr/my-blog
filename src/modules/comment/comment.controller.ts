import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentMapper } from './comment.mapper';
import { CommentDto } from './comment.dto';

@ApiTags('Comment Controller')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Get Comments' })
  @ApiResponse({
    status: 200,
    description: 'Comments by post ID',
  })
  @ApiParam({
    description: 'Post ID',
    name: 'articleId',
  })
  @Get('article/:articleId')
  async getCommentsByArticleId(@Param('articleId') articleId: number) {
    const comments = await this.commentService.getByPostId(articleId);

    return comments.map((comment) => CommentMapper.toDto(comment));
  }

  @ApiOperation({ summary: 'Create Comment' })
  @ApiResponse({
    status: 200,
    description: 'Create Comment',
  })
  @ApiBody({
    description: 'Comment request body',
    type: CommentDto,
  })
  @ApiParam({
    description: 'Post Id',
    name: 'articleId',
  })
  @ApiQuery({
    description: 'Author ID',
    name: 'userId',
  })
  @Post('article/:articleId')
  async createComment(
    @Body() payload: CommentDto,
    @Param('articleId') articleId: number,
    @Query('userId') userId: number,
  ) {
    const comment = CommentMapper.fromDto(payload);

    await this.commentService.createComment(comment, userId, articleId);
  }
}
