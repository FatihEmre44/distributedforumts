import { Router } from "express";

import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";

const createUsersRouter = (userService: UserService): Router => {
	const router = Router();
	const controller = new UserController(userService);

	router.post("/", controller.createUser);
	router.get("/", controller.listUsers);

	return router;
};

export { createUsersRouter };
