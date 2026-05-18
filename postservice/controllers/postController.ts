import { Request, Response } from "express";

import { PostService } from "../services/postService";

export class PostController {
	private readonly postService: PostService;

	constructor(postService: PostService) {
		this.postService = postService;
	}

	createPost = async (req: Request, res: Response): Promise<void> => {
		try {
			const post = await this.postService.createPost(req.body);
			res.status(201).json(post.toJSON());
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	};

	listPosts = async (_req: Request, res: Response): Promise<void> => {
		const posts = await this.postService.listPosts();
		res.json(posts.map((post) => post.toJSON()));
	};

	deletePost = async (req: Request, res: Response): Promise<void> => {
		const deleted = await this.postService.deletePost(req.params.id);
		if (!deleted) {
			res.status(404).json({ error: "Post not found" });
			return;
		}
		res.json(deleted.toJSON());
	};
}
