export interface IQueueProvider {
	connect(): Promise<void>;
	publish(queue: string, message: string): Promise<void>;
	subscribe(queue: string, callback: (message: string) => Promise<void> | void): Promise<void>;
}
