import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserService } from "../user/user.service.js";
import { UserRepository } from "../user/user.repository.js";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).send({ error: "Unauthorised" });
      return;
    }
    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      emailId: string;
    };

    const user = await userService.getUser(String(decryptedToken.userId));

    if (!user) {
      res.status(401).send({ error: "Unauthorised" });
      return;
    }
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
