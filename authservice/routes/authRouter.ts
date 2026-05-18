import { Router } from "express";

import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";

const createAuthRouter = (authService: AuthService): Router => {
	const router = Router();
	const controller = new AuthController(authService);

	router.post("/register", controller.register);
	router.post("/login", controller.login);

	return router;
};

export { createAuthRouter };
