const express = require("express");
const http = require("http");

const app = express();
const servers = ["http://localhost:5001", "http://localhost:5002"];
let current = 0;

app.get("/", (req, res) => {
    const target = servers[current];
    current = (current + 1) % servers.length;

    http.get(target, (backendRes) => {
        let data = "";
        backendRes.on("data", chunk => data += chunk);
        backendRes.on("end", () => res.send(data));
    }).on("error", () => res.status(500).send("Server error"));
});

app.listen(3000, () => console.log("Load Balancer running on port 3000"));
