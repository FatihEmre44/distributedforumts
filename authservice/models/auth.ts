export interface AuthTokenProps {
	userId?: string | null;
	token?: string;
	createdAt?: Date | string | null;
	expiresAt?: Date | string | null;
}

export class AuthToken {
	userId: string | null;
	token: string;
	createdAt: Date;
	expiresAt: Date | null;

	constructor({ userId, token, createdAt, expiresAt }: AuthTokenProps = {}) {
		this.userId = userId ?? null;
		this.token = token ?? "";
		this.createdAt = createdAt ? new Date(createdAt) : new Date();
		this.expiresAt = expiresAt ? new Date(expiresAt) : null;
	}

	isExpired(atTime: Date = new Date()): boolean {
		if (!this.expiresAt) {
			return false;
		}
		return this.expiresAt.getTime() <= atTime.getTime();
	}

	toJSON(): { userId: string | null; token: string; createdAt: Date; expiresAt: Date | null } {
		return {
			userId: this.userId,
			token: this.token,
			createdAt: this.createdAt,
			expiresAt: this.expiresAt,
		};
	}
}
