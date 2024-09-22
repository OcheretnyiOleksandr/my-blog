import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  post_id: number;

  @Column({ type: 'varchar', nullable: false })
  comment: string;

  @Column({ type: 'timestamp', nullable: false })
  createdAt: Date;
}
