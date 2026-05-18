import { User, UserProps } from "../models/user";

export class UserService {
	private usersById: Map<string, User>;

	constructor() {
		this.usersById = new Map();
	}

	async createUser({ id, username, sadakatpuani = 0 }: UserProps = {}): Promise<User> {
		const user = new User({ id, username, sadakatpuani });
		if (!user.id) {
			throw new Error("User id is required");
		}
		if (this.usersById.has(user.id)) {
			throw new Error("User already exists");
		}
		this.usersById.set(user.id, user);
		return user;
	}

	async findById(userId: string): Promise<User | null> {
		return this.usersById.get(userId) ?? null;
	}

	async findByUsername(username: string): Promise<User | null> {
		for (const user of this.usersById.values()) {
			if (user.username === username) {
				return user;
			}
		}
		return null;
	}

	async listUsers(): Promise<User[]> {
		return Array.from(this.usersById.values());
	}

	async deleteUser(userId: string): Promise<boolean> {
		return this.usersById.delete(userId);
	}

	async increaseSadakat(userId: string, puan: number): Promise<User | null> {
		const user = await this.findById(userId);
		if (!user) {
			return null;
		}
		user.increaseSadakat(puan);
		return user;
	}

	async incrementPostCount(userId: string): Promise<User | null> {
		const user = await this.findById(userId);
		if (!user) {
			return null;
		}
		user.incrementPostCount();
		return user;
	}

	async decrementPostCount(userId: string): Promise<User | null> {
		const user = await this.findById(userId);
		if (!user) {
			return null;
		}
		user.decrementPostCount();
		return user;
	}
}
