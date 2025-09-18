import { checkInventory, reserveIngredients, saveOrder } from './redisService';
import { drinkFormulas } from '../models/drinks';
import Redis from 'ioredis';

describe('Redis Service', () => {
  const redis = new Redis();
  const testOrderId = 'test123';
  const drinkType = 'cosmic_punch';
  const quantity = 2;

  beforeAll(async () => {
    // Seed inventory for test
    const formula = drinkFormulas[drinkType];
    if (!formula) throw new Error('Invalid drinkType for test');
    for (const ingredient of Object.keys(formula)) {
      await redis.zadd('ingredient_inventory', 100, ingredient);
    }
  });

  afterAll(async () => {
    await redis.del(`order:${testOrderId}`);
    await redis.quit();
  });

  it('should have enough inventory for a valid order', async () => {
    const result = await checkInventory(drinkType, quantity);
    expect(result).toBe(true);
  });

  it('should reserve ingredients for an order', async () => {
    await reserveIngredients(drinkType, quantity);
    const formula = drinkFormulas[drinkType];
    if (!formula) throw new Error('Invalid drinkType for test');
    for (const [ingredient, amount] of Object.entries(formula)) {
      const score = await redis.zscore('ingredient_inventory', ingredient);
      expect(Number(score)).toBeLessThanOrEqual(100 - amount * quantity);
    }
  });

  it('should save an order in Redis', async () => {
    await saveOrder(testOrderId, drinkType, quantity, 'pending');
    const order = await redis.hgetall(`order:${testOrderId}`);
  expect(order['drinkType']).toBe(drinkType);
  expect(order['quantity']).toBe(quantity.toString());
  expect(order['status']).toBe('pending');
  });
});
