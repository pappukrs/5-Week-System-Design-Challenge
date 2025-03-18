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