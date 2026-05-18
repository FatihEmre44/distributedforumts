import { Router } from "express";

import { TopicController } from "../controllers/topicController";
import { TopicService } from "../services/topicService";

const createTopicsRouter = (topicService: TopicService): Router => {
	const router = Router();
	const controller = new TopicController(topicService);

	router.post("/", controller.createTopic);
	router.get("/", controller.listTopics);
	router.get("/trending", controller.getTrending);

	return router;
};

export { createTopicsRouter };
