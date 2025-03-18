# **📅 Day 8: Distributed Transactions & Sagas - Ensuring Data Consistency** 🚀  

Today, we’ll dive into **Distributed Transactions & Sagas**, which help maintain **data consistency across microservices**. We’ll implement **a Saga Pattern using Kafka & Node.js** with a real-world example.  

---

## **📌 Part 1: What are Distributed Transactions?**
A **Distributed Transaction** updates data across multiple microservices/databases. If **one part fails, everything must roll back** to maintain consistency.  

### **🔹 Why are they challenging?**
❌ **Two-Phase Commit (2PC) is slow** → Locks data across databases, reducing performance.  
❌ **Network Failures** → If one microservice fails, rollback becomes tricky.  
❌ **Scalability Issues** → Traditional transactions don’t work well with microservices.  

**💡 Solution? Use the Saga Pattern!**  

---

## **📌 Part 2: What is the Saga Pattern?**
Saga is a **sequence of local transactions** where each step **triggers the next**, ensuring consistency **without locking databases**.  

### **🔹 Types of Sagas**
1️⃣ **Choreography (Event-Driven)** → Each service **subscribes to events** from other services.  
2️⃣ **Orchestration (Central Controller)** → A **Saga Orchestrator** manages all service interactions.  

**📢 We will implement the Orchestration Saga Pattern using Kafka!**  

---

## **📌 Part 3: Hands-on Saga Pattern in Node.js**
We will create a **Food Order System** using 3 microservices:  
1️⃣ **Order Service** → Creates orders.  
2️⃣ **Payment Service** → Handles payments.  
3️⃣ **Inventory Service** → Checks stock availability.  
🔹 **Kafka (Event Bus)** → Passes events between services.  

---

## **🛠 Step 1: Set Up Kafka & PostgreSQL with Docker**
📍 **Create `docker-compose.yml`**
```yaml
version: '3'
services:
  postgres:
    image: postgres
    container_name: postgres
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: saga_db
    ports:
      - "5432:5432"

  kafka:
    image: bitnami/kafka
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_CFG_ZOOKEEPER_CONNECT: "zookeeper:2181"
      ALLOW_PLAINTEXT_LISTENER: "yes"

  zookeeper:
    image: bitnami/zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
    environment:
      ALLOW_ANONYMOUS_LOGIN: "yes"
```

🔥 **Start the containers**
```bash
docker-compose up -d
```

---

## **🛠 Step 2: Install Node.js Dependencies**
```bash
npm init -y
npm install express pg kafka-node
```

---

## **🛠 Step 3: Create the Order Service**
📍 **Create `orderService.js`**
```js
const express = require("express");
const kafka = require("kafka-node");

const app = express();
app.use(express.json());

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka.Producer(client);

producer.on("ready", () => console.log("✅ Kafka Producer is ready"));

app.post("/order", (req, res) => {
    const order = { orderId: Date.now(), product: req.body.product, status: "PENDING" };
    
    producer.send([{ topic: "order-created", messages: JSON.stringify(order) }], (err, data) => {
        if (err) return res.status(500).send("❌ Kafka Error");
        console.log("📨 Order Created Event Sent:", order);
        res.status(201).send(order);
    });
});

app.listen(4000, () => console.log("🚀 Order Service Running on Port 4000"));
```

---

## **🛠 Step 4: Create the Payment Service**
📍 **Create `paymentService.js`**
```js
const express = require("express");
const { Pool } = require("pg");
const kafka = require("kafka-node");

const app = express();
const pool = new Pool({ user: "user", host: "localhost", database: "saga_db", password: "password", port: 5432 });

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(client, [{ topic: "order-created", partition: 0 }], { autoCommit: true });
const producer = new kafka.Producer(client);

consumer.on("message", async (message) => {
    const order = JSON.parse(message.value);
    
    const paymentSuccess = Math.random() > 0.2; // Simulate success (80% success rate)
    if (paymentSuccess) {
        order.status = "PAID";
        producer.send([{ topic: "payment-success", messages: JSON.stringify(order) }], () => {
            console.log("💰 Payment Successful Event Sent:", order);
        });
    } else {
        order.status = "FAILED";
        producer.send([{ topic: "payment-failed", messages: JSON.stringify(order) }], () => {
            console.log("❌ Payment Failed Event Sent:", order);
        });
    }
});

app.listen(5000, () => console.log("🚀 Payment Service Running on Port 5000"));
```

---

## **🛠 Step 5: Create the Inventory Service**
📍 **Create `inventoryService.js`**
```js
const express = require("express");
const { Pool } = require("pg");
const kafka = require("kafka-node");

const app = express();
const pool = new Pool({ user: "user", host: "localhost", database: "saga_db", password: "password", port: 5432 });

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(client, [{ topic: "payment-success", partition: 0 }], { autoCommit: true });
const producer = new kafka.Producer(client);

consumer.on("message", async (message) => {
    const order = JSON.parse(message.value);
    
    const stockAvailable = Math.random() > 0.2; // Simulate stock availability
    if (stockAvailable) {
        order.status = "COMPLETED";
        producer.send([{ topic: "order-completed", messages: JSON.stringify(order) }], () => {
            console.log("📦 Order Completed Event Sent:", order);
        });
    } else {
        order.status = "OUT_OF_STOCK";
        producer.send([{ topic: "order-failed", messages: JSON.stringify(order) }], () => {
            console.log("❌ Order Out of Stock Event Sent:", order);
        });
    }
});

app.listen(6000, () => console.log("🚀 Inventory Service Running on Port 6000"));
```

---

## **🛠 Step 6: Test the Saga Pattern**
### **📌 Create an Order**
```bash
curl -X POST http://localhost:4000/order -H "Content-Type: application/json" -d '{"product": "Phone"}'
```
📢 **Expected Output (Example)**
```
📨 Order Created Event Sent: { orderId: 171234567890, product: "Phone", status: "PENDING" }
💰 Payment Successful Event Sent: { orderId: 171234567890, status: "PAID" }
📦 Order Completed Event Sent: { orderId: 171234567890, status: "COMPLETED" }
```

---

## **📌 Part 5: Summary**
✅ **Order Service** → Creates orders & sends Kafka event  
✅ **Payment Service** → Listens for events, processes payment  
✅ **Inventory Service** → Checks stock, finalizes order  
✅ **Kafka** → Passes events between services  

---

# **📌 Part 6: Next Steps**
🚀 **Try Compensation Transactions** → Rollback payments if inventory fails  
🚀 **Implement a Saga Orchestrator** → Centralize the workflow  
🚀 **Next: API Rate Limiting & Throttling**  

Would you like a **hands-on guide for API Rate Limiting next?** 🔥