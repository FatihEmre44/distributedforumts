import crypto from "crypto";

import { AuthToken, AuthTokenProps } from "../models/auth";

export class AuthService {
	private tokensByValue: Map<string, AuthToken>;
	private usersByUsername: Map<string, { userId: string; passwordHash: string }>;

	constructor() {
		this.tokensByValue = new Map();
		this.usersByUsername = new Map();
	}

	private hashPassword(plain: string): string {
		return crypto.createHash("sha256").update(plain).digest("hex");
	}

	private verifyPassword(plain: string, hash: string): boolean {
		return this.hashPassword(plain) === hash;
	}

	async createToken({ userId, token, createdAt, expiresAt }: AuthTokenProps = {}): Promise<AuthToken> {
		const authToken = new AuthToken({ userId, token, createdAt, expiresAt });
		if (!authToken.token) {
			throw new Error("Token value is required");
		}
		this.tokensByValue.set(authToken.token, authToken);
		return authToken;
	}

	async findByToken(token: string): Promise<AuthToken | null> {
		return this.tokensByValue.get(token) ?? null;
	}

	async isTokenValid(token: string): Promise<boolean> {
		const authToken = await this.findByToken(token);
		if (!authToken) {
			return false;
		}
		return !authToken.isExpired();
	}

	async revokeToken(token: string): Promise<boolean> {
		return this.tokensByValue.delete(token);
	}

	async register(username: string, password: string): Promise<{ userId: string; token: string }> {
		if (!username || !password) {
			throw new Error("Username and password are required");
		}
		if (this.usersByUsername.has(username)) {
			throw new Error("Username already exists");
		}
		const userId = crypto.randomUUID();
		const passwordHash = this.hashPassword(password);
		this.usersByUsername.set(username, { userId, passwordHash });
		const tokenValue = crypto.randomUUID();
		await this.createToken({ userId, token: tokenValue } as AuthTokenProps);
		return { userId, token: tokenValue };
	}

	async login(username: string, password: string): Promise<{ userId: string; token: string }> {
		const record = this.usersByUsername.get(username);
		if (!record) {
			throw new Error("Invalid username or password");
		}
		if (!this.verifyPassword(password, record.passwordHash)) {
			throw new Error("Invalid username or password");
		}
		const tokenValue = crypto.randomUUID();
		await this.createToken({ userId: record.userId, token: tokenValue } as AuthTokenProps);
		return { userId: record.userId, token: tokenValue };
	}
}
