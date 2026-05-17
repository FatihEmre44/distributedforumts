"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const postService_1 = require("./services/postService");
const RabbitMQProvider_1 = require("./services/RabbitMQProvider");
const TopicStatsWorker_1 = require("./services/TopicStatsWorker");
const topicService_1 = require("./services/topicService");
const UserStatsWorker_1 = require("./services/UserStatsWorker");
const userService_1 = require("./services/userService");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "1mb" }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
const userService = new userService_1.UserService();
const topicService = new topicService_1.TopicService();
const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const postsQueue = process.env.POSTS_QUEUE || "posts.events";
const queueProvider = new RabbitMQProvider_1.RabbitMQProvider(rabbitUrl);
const postService = new postService_1.PostService({ queueProvider, queueName: postsQueue });
const userStatsWorker = new UserStatsWorker_1.UserStatsWorker(queueProvider, postsQueue, userService);
const topicStatsWorker = new TopicStatsWorker_1.TopicStatsWorker(queueProvider, postsQueue, topicService);
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.post("/users", async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user.toJSON());
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.get("/users", async (_req, res) => {
    const users = await userService.listUsers();
    res.json(users.map((user) => user.toJSON()));
});
app.post("/posts", async (req, res) => {
    try {
        const post = await postService.createPost(req.body);
        res.status(201).json(post.toJSON());
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.get("/posts", async (_req, res) => {
    const posts = await postService.listPosts();
    res.json(posts.map((post) => post.toJSON()));
});
app.post("/topics", async (req, res) => {
    try {
        const topic = await topicService.createTopic(req.body);
        res.status(201).json(topic.toJSON());
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.get("/topics", async (_req, res) => {
    const topics = await topicService.listTopics();
    res.json(topics.map((topic) => topic.toJSON()));
});
app.delete("/posts/:id", async (req, res) => {
    const deleted = await postService.deletePost(req.params.id);
    if (!deleted) {
        res.status(404).json({ error: "Post not found" });
        return;
    }
    res.json(deleted.toJSON());
});
app.get("/topics/trending", async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const topics = await topicService.getTrendingTopics(limit);
    res.json(topics.map((topic) => topic.toJSON()));
});
const port = Number(process.env.PORT) || 3000;
const startServer = async () => {
    try {
        await queueProvider.connect();
        await userStatsWorker.start();
        await topicStatsWorker.start();
        app.listen(port, () => {
            console.log(`GsForum API listening on port ${port}`);
        });
    }
    catch (error) {
        console.error("Startup failed:", error);
        process.exit(1);
    }
};
void startServer();
