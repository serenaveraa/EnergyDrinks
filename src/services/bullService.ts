const Bull = require('bull');
import { reserveIngredients, saveOrder, checkInventory } from './redisService';

export const productionQueue = new Bull('production_queue', {
	redis: { port: 6379, host: '127.0.0.1' }
});

export async function addOrderToQueue(orderId: string) {
	await productionQueue.add({ orderId });
}

export async function checkAndReserveInventory(drinkType: string, quantity: number): Promise<boolean> {
	const ok = await checkInventory(drinkType, quantity);
	if (!ok) return false;
	await reserveIngredients(drinkType, quantity);
	return true;
}

export async function saveOrderToRedis(orderId: string, drinkType: string, quantity: number, status: string) {
	await saveOrder(orderId, drinkType, quantity, status);
}
