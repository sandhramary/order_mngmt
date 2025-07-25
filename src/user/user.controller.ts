import { Request, Response } from "express";
import validator from "validator";

import { UserService } from "./user.service.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async createUser(req: Request, res: Response) {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).send({ error: "Invalid input" });
      return;
    }

    if (password?.length < 8) {
      res.status(400).send({ error: "Invalid password" });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).send({ error: "Invalid email" });
      return;
    }

    try {
      const newUser = await this.userService.createUser(req.body);
      const token = newUser?.generateAuthToken();
      res.send({ ...newUser, token });
    } catch {
      res.status(500).send();
    }
  }

  async userLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ error: "Invalid input" });
      return;
    }
    try {
      const user = await this.userService.userLogin(email, password);
      const token = user?.generateAuthToken();
      res.send({ ...user, token });
    } catch {
      res.status(500).send();
    }
  }

  async getUser(req: any, res: Response) {
    const userId = req.user.id;
    try {
      const user = await this.userService.getUser(userId);
      if (user) {
        res.send(user);
        return;
      }
      res.status(404).send();
    } catch {
      res.status(500).send();
    }
  }

  async deleteUser(req: any, res: Response) {
    const userId = req.user.id;
    try {
      const isSuccess = await this.userService.deleteUser(userId);
      if (isSuccess) {
        res.send({ message: "User deleted successfully" });
        return;
      }
      res.send({ message: "User deletion failed" });
    } catch {
      res.status(500).send();
    }
  }
}
