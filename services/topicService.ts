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

	async listTopics(): Promise<Topic[]> {
		return Array.from(this.topicsById.values());
	}

	async deleteTopic(topicId: string): Promise<boolean> {
		return this.topicsById.delete(topicId);
	}

	async addPostToTopic(topicId: string, postId: string): Promise<Topic | null> {
		const topic = await this.findById(topicId);
		if (!topic) {
			return null;
		}
		topic.addPost(postId);
		return topic;
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

	async getTrendingTopics(limit = 10): Promise<Topic[]> {
		return Array.from(this.topicsById.values())
			.sort((a, b) => {
				if (b.postCount !== a.postCount) {
					return b.postCount - a.postCount;
				}
				const aTime = a.lastActivity ? a.lastActivity.getTime() : 0;
				const bTime = b.lastActivity ? b.lastActivity.getTime() : 0;
				return bTime - aTime;
			})
			.slice(0, Math.max(0, limit));
	}
}
