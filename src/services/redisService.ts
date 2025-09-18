import Redis from 'ioredis';
import { drinkFormulas } from '../models/drinks';
const redis = new Redis();

export async function checkInventory(drinkType: string, quantity: number): Promise<boolean> {
	const formula = drinkFormulas[drinkType];
	if (!formula) return false;
	for (const [ingredient, amount] of Object.entries(formula)) {
		const required = amount * quantity;
		const current = await redis.zscore('ingredient_inventory', ingredient);
		if (current === null || Number(current) < required) return false;
	}
	return true;
}

export async function reserveIngredients(drinkType: string, quantity: number): Promise<void> {
		const formula = drinkFormulas[drinkType];
		if (!formula) return;
		for (const [ingredient, amount] of Object.entries(formula)) {
			const required = amount * quantity;
			await redis.zincrby('ingredient_inventory', -required, ingredient);
		}
}

export async function saveOrder(orderId: string, drinkType: string, quantity: number, status: string): Promise<void> {
	await redis.hset(`order:${orderId}`, {
		drinkType,
		quantity,
		status
	});
}
