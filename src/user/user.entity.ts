import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import jwt from "jsonwebtoken";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { nullable: false })
  name: string;

  @Column("varchar", { unique: true, nullable: false })
  emailId: string;

  @Column("varchar", { nullable: false })
  password: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  generateAuthToken() {
    const token = jwt.sign(
      { userId: this.id, emailId: this.emailId },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    return token;
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
