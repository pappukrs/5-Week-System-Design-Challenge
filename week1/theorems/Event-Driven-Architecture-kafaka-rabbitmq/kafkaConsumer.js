const kafka = require("kafka-node");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(client, [{ topic: "order-events", partition: 0 }], { autoCommit: true });

consumer.on("message", (message) => {
    console.log("📥 Kafka Event Received:", JSON.parse(message.value));
});