import { Router } from "express";

import { PostController } from "../controllers/postController";
import { PostService } from "../services/postService";

const createPostsRouter = (postService: PostService): Router => {
	const router = Router();
	const controller = new PostController(postService);

	router.post("/", controller.createPost);
	router.get("/", controller.listPosts);
	router.delete("/:id", controller.deletePost);

	return router;
};

export { createPostsRouter };
