"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../models/user");
class UserService {
    constructor() {
        this.usersById = new Map();
    }
    async createUser({ id, username, sadakatpuani = 0 } = {}) {
        const user = new user_1.User({ id, username, sadakatpuani });
        if (!user.id) {
            throw new Error("User id is required");
        }
        if (this.usersById.has(user.id)) {
            throw new Error("User already exists");
        }
        this.usersById.set(user.id, user);
        return user;
    }
    async findById(userId) {
        return this.usersById.get(userId) ?? null;
    }
    async findByUsername(username) {
        for (const user of this.usersById.values()) {
            if (user.username === username) {
                return user;
            }
        }
        return null;
    }
    async listUsers() {
        return Array.from(this.usersById.values());
    }
    async deleteUser(userId) {
        return this.usersById.delete(userId);
    }
    async increaseSadakat(userId, puan) {
        const user = await this.findById(userId);
        if (!user) {
            return null;
        }
        user.increaseSadakat(puan);
        return user;
    }
    async incrementPostCount(userId) {
        const user = await this.findById(userId);
        if (!user) {
            return null;
        }
        user.incrementPostCount();
        return user;
    }
    async decrementPostCount(userId) {
        const user = await this.findById(userId);
        if (!user) {
            return null;
        }
        user.decrementPostCount();
        return user;
    }
}
exports.UserService = UserService;
