import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class News extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: "",
  })
  creator: string;

  @Column({ default: "" })
  title: string;

  @Column({ default: "" })
  slug: string;

  @Column({ default: "" })
  content: string;

  @Column({ default: "" })
  thumbnail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
