import * as amqp from "amqplib";

import { IQueueProvider } from "../interfaces/IQueueProvider";

export class RabbitMQProvider implements IQueueProvider {
	private readonly url: string;
	private connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
	private channel: Awaited<ReturnType<Awaited<ReturnType<typeof amqp.connect>>["createChannel"]>> | null = null;

	constructor(url: string) {
		this.url = url;
	}

	async connect(): Promise<void> {
		try {
			this.connection = await amqp.connect(this.url);
			this.connection.on("error", (err: unknown) => {
				console.error("RabbitMQ connection error:", err);
			});
			this.connection.on("close", () => {
				console.warn("RabbitMQ connection closed");
			});

			this.channel = await this.connection.createChannel();
		} catch (error) {
			console.error("RabbitMQ connect failed:", error);
			throw error;
		}
	}

	async publish(queue: string, message: string): Promise<void> {
		try {
			if (!this.channel) {
				throw new Error("RabbitMQ channel is not initialized");
			}
			await this.channel.assertQueue(queue, { durable: true });
			this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
		} catch (error) {
			console.error(`RabbitMQ publish failed (queue: ${queue}):`, error);
			throw error;
		}
	}

	async subscribe(queue: string, callback: (message: string) => Promise<void> | void): Promise<void> {
		try {
			if (!this.channel) {
				throw new Error("RabbitMQ channel is not initialized");
			}
			await this.channel.assertQueue(queue, { durable: true });
			await this.channel.consume(queue, async (msg: { content: Buffer } | null) => {
				if (!msg) {
					return;
				}
				try {
					const content = msg.content.toString();
					await callback(content);
					this.channel?.ack(msg as unknown as any);
				} catch (callbackError: unknown) {
					console.error(`RabbitMQ callback error (queue: ${queue}):`, callbackError);
					this.channel?.nack(msg as unknown as any, false, true);
				}
			});
		} catch (error) {
			console.error(`RabbitMQ subscribe failed (queue: ${queue}):`, error);
			throw error;
		}
	}
}
