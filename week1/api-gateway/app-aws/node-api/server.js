const express = require("express");
const app = express();

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from AWS API Gateway!" });
});

app.listen(3000, () => console.log("Node API running on port 3000"));
