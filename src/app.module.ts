import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { AuthModule } from './modules/google/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './config/db/db.module';
import { LikeModule } from './modules/like/like.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    DbModule,
    UserModule,
    PostModule,
    CommentModule,
    LikeModule,
  ],
})
export class AppModule {}
