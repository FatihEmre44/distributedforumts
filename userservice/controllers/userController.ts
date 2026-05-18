import { Request, Response } from "express";

import { UserService } from "../services/userService";

export class UserController {
	private readonly userService: UserService;

	constructor(userService: UserService) {
		this.userService = userService;
	}

	createUser = async (req: Request, res: Response): Promise<void> => {
		try {
			const user = await this.userService.createUser(req.body);
			res.status(201).json(user.toJSON());
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	};

	listUsers = async (_req: Request, res: Response): Promise<void> => {
		const users = await this.userService.listUsers();
		res.json(users.map((user) => user.toJSON()));
	};
}
