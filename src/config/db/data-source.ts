import { DataSource } from 'typeorm';
import { User } from '../../modules/user/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'testUser',
  password: 'testUser',
  database: 'my_blog_db',
  entities: [User],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
});
