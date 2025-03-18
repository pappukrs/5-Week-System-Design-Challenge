const express = require("express");
const { Pool } = require("pg");
const kafka = require("kafka-node");

const app = express();
const pool = new Pool({ user: "user", host: "localhost", database: "cqrs_db", password: "password", port: 5432 });

// Kafka Consumer Setup
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(client, [{ topic: "order-events", partition: 0 }], { autoCommit: true });

// Store event in DB when received
consumer.on("message", async (message) => {
    const order = JSON.parse(message.value);
    await pool.query("INSERT INTO orders (order_id, product, quantity) VALUES ($1, $2, $3)", 
        [order.orderId, order.product, order.quantity]);
    console.log("📥 Order Event Stored in DB:", order);
});

// Fetch Orders API (Read)
app.get("/orders", async (req, res) => {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
});

app.listen(5000, () => console.log("🚀 Query Service Running on Port 5000"));