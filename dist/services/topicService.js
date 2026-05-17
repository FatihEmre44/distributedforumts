"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicService = void 0;
const topic_1 = require("../models/topic");
class TopicService {
    constructor() {
        this.topicsById = new Map();
    }
    async createTopic({ id, title, authorId, createdAt, postIds } = {}) {
        const topic = new topic_1.Topic({ id, title, authorId, createdAt, postIds });
        if (!topic.id) {
            throw new Error("Topic id is required");
        }
        if (this.topicsById.has(topic.id)) {
            throw new Error("Topic already exists");
        }
        this.topicsById.set(topic.id, topic);
        return topic;
    }
    async findById(topicId) {
        return this.topicsById.get(topicId) ?? null;
    }
    async listTopics() {
        return Array.from(this.topicsById.values());
    }
    async deleteTopic(topicId) {
        return this.topicsById.delete(topicId);
    }
    async addPostToTopic(topicId, postId) {
        const topic = await this.findById(topicId);
        if (!topic) {
            return null;
        }
        topic.addPost(postId);
        return topic;
    }
    async incrementTopicStats(topicId) {
        const topic = await this.findById(topicId);
        if (!topic) {
            return null;
        }
        topic.postCount += 1;
        topic.lastActivity = new Date();
        return topic;
    }
    async decrementTopicStats(topicId, postId) {
        const topic = await this.findById(topicId);
        if (!topic) {
            return null;
        }
        topic.postCount = Math.max(0, topic.postCount - 1);
        topic.postIds = topic.postIds.filter((id) => id !== postId);
        topic.lastActivity = new Date();
        return topic;
    }
    async getTrendingTopics(limit = 10) {
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
exports.TopicService = TopicService;
