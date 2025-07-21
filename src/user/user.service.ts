import bcrypt from "bcryptjs";

import { UserRepository } from "./user.repository.js";
import { CreateUserInput } from "./user.types.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(req: CreateUserInput) {
    const { email, name, password } = req;

    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw Error("Existing user found");
    }

    const encryptedPassword = await bcrypt.hash(password, 8);
    return this.userRepository.createUser({
      ...req,
      password: encryptedPassword,
    });
  }

  async userLogin(emailId: string, password: string) {
    const existingUser = await this.userRepository.getUserByEmail(emailId);
    if (!existingUser) {
      throw Error("Uanble to login");
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) throw new Error("Unable to login");

    return existingUser;
  }

  async getUser(id: string) {
    return this.userRepository.getUserById(Number(id));
  }

  async deleteUser(id: string) {
    return this.userRepository.deleteUser(Number(id));
  }
}
