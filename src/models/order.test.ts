import { checkInventory, reserveIngredients, saveOrder } from '../services/redisService';
import Redis from 'ioredis';

describe('Order Logic', () => {
  const redis = new Redis();
  beforeAll(async () => {
    await redis.zadd('ingredient_inventory', 100, 'sugar', 100, 'caffeine', 100, 'flavor');
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('should validate inventory for cosmic_punch', async () => {
    const result = await checkInventory('cosmic_punch', 5);
    expect(result).toBe(true);
  });

  it('should reject inventory for too large quantity', async () => {
    const result = await checkInventory('cosmic_punch', 1000);
    expect(result).toBe(false);
  });

  it('should reserve ingredients and update inventory', async () => {
    await reserveIngredients('cosmic_punch', 2);
    const sugar = await redis.zscore('ingredient_inventory', 'sugar');
    expect(Number(sugar)).toBeLessThan(100);
  });

  it('should save order in Redis', async () => {
    await saveOrder('testOrder', 'cosmic_punch', 1, 'pending');
    const order = await redis.hgetall('order:testOrder');
  expect(order['drinkType']).toBe('cosmic_punch');
  expect(order['status']).toBe('pending');
  });
});
