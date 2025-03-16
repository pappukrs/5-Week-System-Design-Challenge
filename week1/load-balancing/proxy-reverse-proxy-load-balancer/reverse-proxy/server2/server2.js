const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Hello from Server 2"));
app.listen(5002, () => console.log("Server 2 running on 5002"));
