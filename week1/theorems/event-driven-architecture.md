## **📅 Day 6: Event-Driven Architecture (EDA) with Kafka & RabbitMQ 🚀**  
Today, we will **explore Event-Driven Architecture (EDA)** and implement it using **Kafka and RabbitMQ** with a hands-on **Node.js microservices demo**.

---

# **📌 Part 1: What is Event-Driven Architecture (EDA)?**
### **🔹 Definition:**  
EDA is a **design pattern** where services communicate by **producing and consuming events**, rather than making direct API calls.

### **🔹 Key Concepts:**
- **Event Producer** → Generates an event (e.g., Order Created)
- **Event Broker (Kafka/RabbitMQ)** → Routes and stores events
- **Event Consumer** → Reacts to events (e.g., Send Email when Order is Created)

### **🔹 Benefits of EDA:**
✅ **Decoupling** → Microservices can work independently  
✅ **Scalability** → Handles high loads efficiently  
✅ **Resilience** → Events are stored until processed  

---

# **📌 Part 2: Understanding Kafka & RabbitMQ**
| Feature  | **Kafka**  | **RabbitMQ**  |
|----------|-----------|--------------|
| **Type**  | Distributed Log System | Message Broker |
| **Best For**  | Event Streaming (Big Data, Logs)  | Message Queueing (Tasks, Jobs) |
| **Message Retention** | Stores events for days | Deletes messages after consumption |
| **Performance** | High Throughput | Low Latency |

---

# **📌 Part 3: Hands-on - Kafka & RabbitMQ with Node.js**
We’ll create **two microservices**:
1. **Producer Service** → Sends events (`Order Created`)  
2. **Consumer Service** → Listens for events (`Send Email`)  

---

## **🛠 Step 1: Set Up Kafka & RabbitMQ with Docker**
📍 **Create `docker-compose.yml`**
```yaml
version: '3'
services:
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

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672" # Management UI
```

🔥 **Start the containers**
```bash
docker-compose up -d
```

---

## **🛠 Step 2: Install Node.js Dependencies**
```bash
npm init -y
npm install express kafka-node amqplib
```

---

## **🛠 Step 3: Implement Kafka Producer & Consumer**
📍 **Create `kafkaProducer.js`**
```js
const kafka = require("kafka-node");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka.Producer(client);

producer.on("ready", () => {
    console.log("✅ Kafka Producer is ready");

    const message = JSON.stringify({ orderId: 123, status: "Created" });
    producer.send([{ topic: "order-events", messages: message }], (err, data) => {
        if (err) console.error("❌ Kafka Error:", err);
        else console.log("📨 Kafka Event Sent:", data);
    });
});
```

📍 **Create `kafkaConsumer.js`**
```js
const kafka = require("kafka-node");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(client, [{ topic: "order-events", partition: 0 }], { autoCommit: true });

consumer.on("message", (message) => {
    console.log("📥 Kafka Event Received:", JSON.parse(message.value));
});
```

🔥 **Run Kafka Services**
```bash
node kafkaProducer.js  # Sends event
node kafkaConsumer.js  # Listens for event
```

📢 **Expected Output:**
```
📨 Kafka Event Sent: { order-events: '123' }
📥 Kafka Event Received: { orderId: 123, status: 'Created' }
```

---

## **🛠 Step 4: Implement RabbitMQ Producer & Consumer**
📍 **Create `rabbitProducer.js`**
```js
const amqp = require("amqplib");

async function sendOrder() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "orderQueue";
    await channel.assertQueue(queue, { durable: false });

    const order = { orderId: 456, status: "Created" };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));

    console.log("📨 RabbitMQ Event Sent:", order);
    setTimeout(() => connection.close(), 500);
}

sendOrder();
```

📍 **Create `rabbitConsumer.js`**
```js
const amqp = require("amqplib");

async function receiveOrder() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "orderQueue";
    await channel.assertQueue(queue, { durable: false });

    console.log("📥 RabbitMQ Consumer is waiting...");
    channel.consume(queue, (msg) => {
        console.log("📥 RabbitMQ Event Received:", JSON.parse(msg.content.toString()));
    }, { noAck: true });
}

receiveOrder();
```

🔥 **Run RabbitMQ Services**
```bash
node rabbitProducer.js  # Sends event
node rabbitConsumer.js  # Listens for event
```

📢 **Expected Output:**
```
📨 RabbitMQ Event Sent: { orderId: 456, status: 'Created' }
📥 RabbitMQ Event Received: { orderId: 456, status: 'Created' }
```

---

# **📌 Part 4: Kafka vs. RabbitMQ - Which One to Choose?**
| Feature  | **Kafka** | **RabbitMQ** |
|----------|---------|-------------|
| **Message Retention** | Retains messages | Deletes after consumption |
| **Use Case** | Event Streaming (Big Data, Logs) | Task Queueing (Email, Payments) |
| **Scalability** | High | Moderate |

🚀 **Choose Kafka** → If you need event streaming & log processing  
🚀 **Choose RabbitMQ** → If you need job queues & transactional tasks  

---

# **📌 Part 5: Next Steps**
✅ **Play with Kafka & RabbitMQ!**  
✅ **Simulate network failures and retry logic**  
✅ **Next: CQRS & Event Sourcing**  

Would you like a **hands-on guide for CQRS & Event Sourcing** next? 🚀