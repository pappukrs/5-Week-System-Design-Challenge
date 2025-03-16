const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Reverse proxy to multiple backend servers
app.use("/server1", createProxyMiddleware({ target: "http://localhost:5001", changeOrigin: true }));
app.use("/server2", createProxyMiddleware({ target: "http://localhost:5002", changeOrigin: true }));

app.listen(3000, () => console.log("Reverse Proxy running on port 3000"));
