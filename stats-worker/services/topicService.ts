import { Topic, TopicProps } from "../models/topic";

export class TopicService {
	private topicsById: Map<string, Topic>;

	constructor() {
		this.topicsById = new Map();
	}

	async createTopic({ id, title, authorId, createdAt, postIds }: TopicProps = {}): Promise<Topic> {
		const topic = new Topic({ id, title, authorId, createdAt, postIds });
		if (!topic.id) {
			throw new Error("Topic id is required");
		}
		if (this.topicsById.has(topic.id)) {
			throw new Error("Topic already exists");
		}
		this.topicsById.set(topic.id, topic);
		return topic;
	}

	async findById(topicId: string): Promise<Topic | null> {
		return this.topicsById.get(topicId) ?? null;
	}

	async incrementTopicStats(topicId: string): Promise<Topic | null> {
		const topic = await this.findById(topicId);
		if (!topic) {
			return null;
		}
		topic.postCount += 1;
		topic.lastActivity = new Date();
		return topic;
	}

	async decrementTopicStats(topicId: string, postId: string): Promise<Topic | null> {
		const topic = await this.findById(topicId);
		if (!topic) {
			return null;
		}
		topic.postCount = Math.max(0, topic.postCount - 1);
		topic.postIds = topic.postIds.filter((id) => id !== postId);
		topic.lastActivity = new Date();
		return topic;
	}
}
