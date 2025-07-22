import { Router } from "express";

import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { UserRepository } from "./user.repository.js";
import { auth } from "../middleware/auth.js";

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post("/users", async (req, res) => userController.createUser(req, res));

router.post("/users/login", async (req, res) =>
  userController.userLogin(req, res)
);

router.get("/users/profile", auth, async (req, res) =>
  userController.getUser(req, res)
);

router.delete("/users", auth, async (req, res) =>
  userController.deleteUser(req, res)
);

export default router;
