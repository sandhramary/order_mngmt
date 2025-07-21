import AppDataSource from "../db/data-source.js";
import { User } from "./user.entity.js";
import { CreateUserInput } from "./user.types.js";

export class UserRepository {
  private userRepo = AppDataSource.getRepository(User);

  async getUserByEmail(emailId: string) {
    return this.userRepo.findOne({ where: { emailId } });
  }

  async createUser(userBody: CreateUserInput) {
    const user = this.userRepo.create({
      emailId: userBody.email,
      name: userBody.name,
      password: userBody.password,
    });
    if (user) return this.userRepo.save(user);
    return null;
  }

  async getUserById(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async deleteUser(id: number) {
    const user = await this.getUserById(id);
    if (user) {
      return this.userRepo.remove(user);
    }
    return null;
  }
}
