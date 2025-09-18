
# ⚡️ EnergyDrinks Factory

## 🚀 Descripción

Simulación de una fábrica de bebidas energéticas que gestiona pedidos, inventario y producción de lotes usando:
- Redis (inventario y pedidos)
- Bull (cola de producción)
- Express.js (API)
- TypeScript (tipado robusto)

---

## 📂 Estructura de Archivos

```
EnergyDrinks/
├── package.json
├── tsconfig.json
├── README.md
├── postman_collection.json
├── src/
│   ├── index.ts                # API principal (Express)
│   ├── models/
│   │   ├── drinks.ts           # Fórmulas de bebidas
│   │   └── worker.ts           # Worker Bull para producción
│   ├── services/
│   │   ├── bullService.ts      # Lógica de cola Bull
│   │   ├── redisService.ts     # Lógica de inventario y pedidos en Redis
│   │   └── redisService.test.ts# Tests unitarios
```

---

## 📝 Problema

La fábrica recibe pedidos de bebidas energéticas, cada una con una fórmula única. El sistema debe:
1. Recibir pedidos vía API
2. Verificar y reservar inventario en Redis
3. Añadir pedidos a la cola Bull
4. Producir lotes de forma asíncrona (worker)
5. Actualizar estados y contadores en Redis

---

## 🔗 Endpoint Principal

### `POST /order-drink`
Recibe un pedido de bebida energética.

**Body JSON:**
```json
{
  "orderId": "order1",
  "drinkType": "cosmic_punch", // o lunar_berry, solar_blast
  "quantity": 2
}
```

**Respuestas:**
- `200 OK` → Pedido aceptado y en cola
- `400 Bad Request` → Faltan campos o inventario insuficiente
- `500 Internal Server Error` → Error inesperado

---

## 🧪 Testing & Ejemplos

- Tests unitarios en `src/services/redisService.test.ts`
- Colección Postman en `postman_collection.json` para:
  - Pedido exitoso
  - Pedido fallido por inventario
  - Pedidos simultáneos

---

## 🛠️ Cómo ejecutar

1. Instala dependencias:
	```bash
	npm install
	```
2. Asegúrate de tener Redis corriendo (puedes usar Docker):
	```bash
	docker run -p 6379:6379 redis
	```
3. Compila y ejecuta:
	```bash
	npx tsc
	node dist/index.js
	```
4. Prueba el endpoint con Postman o curl.

---

## 💡 Autor

- [serenaveraa](https://github.com/serenaveraa)
