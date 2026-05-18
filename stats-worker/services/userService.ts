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

	async listUsers(): Promise<User[]> {
		return Array.from(this.usersById.values());
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
