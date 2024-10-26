import { DataSource } from 'typeorm';
import { User } from '../../modules/user/user.entity';
import { Post } from '../../modules/post/post.entity';
import { Comment } from '../../modules/comment/comment.entity';
import { Like } from '../../modules/like/like.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'testUser',
  password: 'testUser',
  database: 'my_blog_db',
  entities: [User, Post, Comment, Like],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
});
