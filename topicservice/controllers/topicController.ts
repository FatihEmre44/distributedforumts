import { Request, Response } from "express";

import { TopicService } from "../services/topicService";

export class TopicController {
	private readonly topicService: TopicService;

	constructor(topicService: TopicService) {
		this.topicService = topicService;
	}

	createTopic = async (req: Request, res: Response): Promise<void> => {
		try {
			const topic = await this.topicService.createTopic(req.body);
			res.status(201).json(topic.toJSON());
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	};

	listTopics = async (_req: Request, res: Response): Promise<void> => {
		const topics = await this.topicService.listTopics();
		res.json(topics.map((topic) => topic.toJSON()));
	};

	getTrending = async (req: Request, res: Response): Promise<void> => {
		const limit = Number(req.query.limit) || 10;
		const topics = await this.topicService.getTrendingTopics(limit);
		res.json(topics.map((topic) => topic.toJSON()));
	};
}
