const express = require('express');
import * as bodyParser from 'body-parser';
import { addOrderToQueue, checkAndReserveInventory, saveOrderToRedis } from './services/bullService';

const app = express();
app.use(bodyParser.json());

app.post('/order-drink', async (req: any, res: any) => {
	const { orderId, drinkType, quantity } = req.body;
	if (!orderId || !drinkType || !quantity) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	try {
		// Check and reserve inventory, save order, add to queue
		const inventoryOk = await checkAndReserveInventory(drinkType, quantity);
		if (!inventoryOk) {
			await saveOrderToRedis(orderId, drinkType, quantity, 'rejected');
			return res.status(400).json({ error: 'Insufficient inventory' });
		}
		await saveOrderToRedis(orderId, drinkType, quantity, 'pending');
		await addOrderToQueue(orderId);
		return res.status(200).json({ message: 'Order accepted and queued' });
	} catch (err) {
		return res.status(500).json({ error: 'Internal server error', details: (err as Error).message });
	}

});

const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
	console.log(`Energy Drinks Factory API running on port ${PORT}`);
});
