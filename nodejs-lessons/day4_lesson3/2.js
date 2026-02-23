// services/order.service.js
import { EventEmitter, once, on } from "node:events";

// Create Service with EventEmitter
class OrderService extends EventEmitter {
  constructor() {
    super();
    this.orders = [];
  }

  async createOrder(orderData) {
    // Create order
    const order = {
      id: Date.now(),
      ...orderData,
      status: "created",
      createdAt: new Date()
    };

    this.orders.push(order);

    // Emit event (decoupled from implementation)
    this.emit("order:created", order);

    return order;
  }

  async cancelOrder(orderId) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = "cancelled";
      this.emit("order:cancelled", order);
    }
    return order;
  }
}

export const orderService = new OrderService();

// Event Listeners (Subscribers)
orderService.on("order:created", async (order) => {
  console.log(`📧 Sending email for order ${order.id}`);
  // await sendEmail(...)
});

orderService.on("order:created", async (order) => {
  console.log(`📦 Decrementing inventory for order ${order.id}`);
  // await decrementInventory(...)
});

orderService.on("order:cancelled", async (order) => {
  console.log(`📧 Sending cancellation email for order ${order.id}`);
});

orderService.on("order:cancelled", async (order) => {
  console.log(`📦 Restoring inventory for order ${order.id}`);
});

// Demo
console.log("=== EventEmitter Pub/Sub Pattern ===\n");

const order1 = await orderService.createOrder({
  userId: 123,
  items: [{ productId: 1, quantity: 2 }],
  total: 50
});

console.log("\nCreated order:", order1);

await new Promise((resolve) => setTimeout(resolve, 1000));

await orderService.cancelOrder(order1.id);

// Advanced EventEmitter Patterns
console.log("\n=== Advanced Patterns ===\n");

// 1. Wait for single event (Promise)
const emitter = new EventEmitter();

async function waitForReady() {
  console.log("Waiting for 'ready' event...");
  await once(emitter, "ready");
  console.log(" Server is ready!");
}

waitForReady();
setTimeout(() => emitter.emit("ready"), 1000);

// 2. Symbol event names (prevent collisions)
const ORDER_CREATED = Symbol("order:created");
console.log("\n Use Symbol event names to prevent collisions");

// 3. Capture async errors in listeners
const safeEmitter = new EventEmitter({ captureRejections: true });

safeEmitter.on("data", async (value) => {
  // If this throws, EventEmitter catches it
  console.log("Processing:", value);
});

safeEmitter.on("error", (err) => {
  console.error("Listener error:", err.message);
});

console.log("\nUse Cases:");
console.log(" Decouple services (pub/sub)");
console.log(" Event-driven architecture");
console.log(" Plugin systems");
console.log(" Workflow orchestration");
