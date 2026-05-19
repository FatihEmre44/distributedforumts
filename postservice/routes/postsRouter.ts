import { Router } from "express";

import { PostController } from "../controllers/postController";
import { PostService } from "../services/postService";
import { requireAuth } from "../middleware/requireAuth";

const createPostsRouter = (postService: PostService): Router => {
	const router = Router();
	const controller = new PostController(postService);

	router.post("/", requireAuth, controller.createPost);
	router.get("/", controller.listPosts);
	router.delete("/:id", controller.deletePost);

	return router;
};

export { createPostsRouter };
