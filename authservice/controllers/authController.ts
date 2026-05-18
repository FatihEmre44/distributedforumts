import { Request, Response } from "express";

import { AuthService } from "../services/authService";

export class AuthController {
	private readonly authService: AuthService;

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	register = async (req: Request, res: Response): Promise<void> => {
		try {
			const { username, password } = req.body ?? {};
			const result = await this.authService.register(username, password);
			res.status(201).json(result);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	};

	login = async (req: Request, res: Response): Promise<void> => {
		try {
			const { username, password } = req.body ?? {};
			const result = await this.authService.login(username, password);
			res.json(result);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	};
}
