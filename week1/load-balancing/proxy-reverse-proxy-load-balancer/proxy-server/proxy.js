const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Proxy all requests to JSONPlaceholder API
app.use("/api", createProxyMiddleware({ target: "https://jsonplaceholder.typicode.com", changeOrigin: true }));

app.listen(3000, () => console.log("Proxy Server running on port 3000"));
