const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Hello from Server 1"));
app.listen(5001, () => console.log("Server 1 running on 5001"));
