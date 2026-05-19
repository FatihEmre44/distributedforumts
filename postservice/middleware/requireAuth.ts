import { NextFunction, Request, Response } from "express";

const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3004";

const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const header = req.headers.authorization || "";
	if (!header.startsWith("Bearer ")) {
		res.status(401).json({ error: "Missing or invalid Authorization header" });
		return;
	}

	try {
		const response = await fetch(`${authServiceUrl}/auth/validate`, {
			method: "POST",
			headers: {
				Authorization: header,
			},
		});

		if (!response.ok) {
			res.status(401).json({ error: "Invalid or expired token" });
			return;
		}
	} catch (error) {
		console.error("Auth validation failed:", error);
		res.status(502).json({ error: "Auth service unavailable" });
		return;
	}

	next();
};

export { requireAuth };
