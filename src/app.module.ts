import { Module } from '@nestjs/common';
import { DbModule } from './config/db/db.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [DbModule, UserModule, PostModule, CommentModule],
})
export class AppModule {}
