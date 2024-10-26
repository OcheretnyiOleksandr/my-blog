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
import { CommentService } from './comment.service';
import { CommentMapper } from './comment.mapper';
import { CommentDto } from './comment.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Comment Controller')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get Comments' })
  @ApiResponse({
    status: 200,
    description: 'Comments by post ID',
  })
  @ApiParam({
    description: 'Post ID',
    name: 'articleId',
  })
  @Get(':articleId')
  async getCommentsByArticleId(
    @Param('articleId') articleId: number,
  ): Promise<CommentDto[]> {
    const comments = await this.commentService.getCommentByPostId(articleId);

    return comments.map((comment) => CommentMapper.toDto(comment));
  }

  @UseGuards(AuthGuard('jwt'))
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
  @Post(':articleId')
  async createComment(
    @Body() payload: CommentDto,
    @Param('articleId') articleId: number,
    @Query('userId') userId: number,
  ) {
    const comment = CommentMapper.fromDto(payload);

    await this.commentService.createComment(comment, userId, articleId);
  }
}
