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