import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";

@Entity()
export class Discount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("int", { array: true })
  productsId: number[];

  @Column({ default: new Date() })
  startday: Date;

  @Column({ default: new Date() })
  endday: Date;

  @Column()
  percent: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
