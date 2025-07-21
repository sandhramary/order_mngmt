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
      res.send(newUser);
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
      res.send(user);
    } catch {
      res.status(500).send();
    }
  }

  async getUser(req: Request, res: Response) {
    const { userId } = req.params;
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

  async deleteUser(req: Request, res: Response) {
    const { userId } = req.params;
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
