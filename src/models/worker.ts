import { productionQueue } from '../services/bullService';
import Redis from 'ioredis';
import type { Job } from 'bull';
const redis = new Redis();

productionQueue.process(async (job: Job) => {
	const { orderId } = job.data;
	await redis.hset(`order:${orderId}`, { status: 'in_production' });
	await new Promise(res => setTimeout(res, 3000));
	const order = await redis.hgetall(`order:${orderId}`);
	const { drinkType, quantity } = order;
	await redis.hset(`order:${orderId}`, { status: 'completed' });
	await redis.incrby(`drink_count:${drinkType}`, Number(quantity));
	return { orderId, status: 'completed' };
});
