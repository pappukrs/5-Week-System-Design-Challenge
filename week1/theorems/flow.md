## **🔥 CAP Theorem & PACELC Theorem - Deep Dive with Hands-On Implementation 🚀**  

Today, we'll explore **CAP Theorem** and **PACELC Theorem**, understand their real-world trade-offs, and implement **MongoDB (AP) and PostgreSQL (CP)** to see these concepts in action.

---

# **📌 Part 1: Understanding CAP Theorem**
## **🔹 What is the CAP Theorem?**
CAP Theorem states that a **distributed database** can **only guarantee two** out of these three properties:  

1️⃣ **Consistency (C)** → Every read receives the most recent write.  
2️⃣ **Availability (A)** → Every request gets a response (even if data is outdated).  
3️⃣ **Partition Tolerance (P)** → The system continues to function despite network failures.

| Type  | Guarantees | Example Databases |
|--------|-------------|------------------|
| **CP**  | Consistency + Partition Tolerance | PostgreSQL, Google Spanner |
| **AP**  | Availability + Partition Tolerance | MongoDB, Cassandra |
| **CA**  | Consistency + Availability | **Impossible** in a distributed system |

⚠️ **Tradeoff:**  
- If a network partition happens, you must **choose between Availability or Consistency**.  

---

# **📌 Part 2: Understanding PACELC Theorem**
## **🔹 What is the PACELC Theorem?**
PACELC extends CAP by considering trade-offs **even when there is no network failure**.

- **If Partitioned (P) → Choose A (Availability) or C (Consistency).**
- **Else (E) → Choose L (Low Latency) or C (Strong Consistency).**

| Scenario  | Trade-Off | Example Database |
|-----------|-----------|-----------------|
| **Partitioned (P)**  | **A vs C** | MongoDB (A), PostgreSQL (C) |
| **No Partition (E)** | **L vs C** | DynamoDB (L), Spanner (C) |

🔹 **Example:** MongoDB prioritizes **Availability + Low Latency**, while PostgreSQL prioritizes **Consistency + Strong Consistency**.

---

# **📌 Part 3: Hands-On - Comparing MongoDB (AP) vs PostgreSQL (CP)**
We'll run **MongoDB (AP) and PostgreSQL (CP) on Docker**, create a Node.js app, and observe **CAP trade-offs in action**.

---

## **🛠 Step 1: Set Up Docker Compose for MongoDB & PostgreSQL**
📍 **Create `docker-compose.yml`**
```yaml
version: "3.8"
services:
  mongodb:
    image: mongo
    container_name: mongodb
    ports:
      - "27017:27017"

  postgres:
    image: postgres
    container_name: postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: testdb
    ports:
      - "5432:5432"
```
🔥 **Start the databases with Docker Compose**
```bash
docker-compose up -d
```

---

## **🛠 Step 2: Install Node.js and Required Libraries**
```bash
npm init -y
npm install express mongoose pg pg-promise
```

---

## **🛠 Step 3: Implement MongoDB (AP)**
📍 **Create `mongo.js`**
```js
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

const User = mongoose.model("User", userSchema);

async function addUser() {
    await User.create({ name: "Alice", age: 25 });
    console.log("✅ MongoDB - User Added");
}

async function getUsers() {
    const users = await User.find();
    console.log("📌 MongoDB - Users:", users);
}

addUser().then(() => setTimeout(getUsers, 2000));
```
🔥 **How MongoDB (AP) works?**
- Prioritizes **Availability** → Allows writes even if data is not instantly replicated.
- If network fails, writes **may not be immediately consistent**.

---

## **🛠 Step 4: Implement PostgreSQL (CP)**
📍 **Create `postgres.js`**
```js
const { Client } = require("pg");

const client = new Client({
    user: "user",
    host: "localhost",
    database: "testdb",
    password: "password",
    port: 5432,
});

async function run() {
    await client.connect();

    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            age INT
        )
    `);

    await client.query("INSERT INTO users (name, age) VALUES ($1, $2)", ["Bob", 30]);

    const result = await client.query("SELECT * FROM users");
    console.log("📌 PostgreSQL - Users:", result.rows);

    await client.end();
}

run();
```
🔥 **How PostgreSQL (CP) works?**
- Prioritizes **Consistency** → Ensures strong consistency.
- If a network partition occurs, PostgreSQL **stops processing** rather than serving stale data.

---

## **🛠 Step 5: Run the Scripts**
1️⃣ **Start MongoDB & PostgreSQL**
```bash
docker-compose up -d
```
2️⃣ **Run MongoDB Test (AP)**
```bash
node mongo.js
```
📢 **Expected Output:**
```
✅ MongoDB - User Added
📌 MongoDB - Users: [{ name: 'Alice', age: 25 }]
```

3️⃣ **Run PostgreSQL Test (CP)**
```bash
node postgres.js
```
📢 **Expected Output:**
```
📌 PostgreSQL - Users: [{ id: 1, name: 'Bob', age: 30 }]
```

---

# **📌 Part 4: CAP & PACELC Observations**
## **🚀 What Happens During a Network Partition?**
1. **MongoDB (AP)**
   - Writes **continue** even during network failures.
   - But **data may not be immediately consistent** across nodes.
   
2. **PostgreSQL (CP)**
   - Prioritizes **data consistency**.
   - **Stops writes** if consistency cannot be guaranteed.

---

## **🔍 Key Takeaways**
| Database | CAP Model | PACELC Model | When to Use? |
|----------|----------|-------------|--------------|
| **MongoDB** | **AP** | **PA/EL** (Availability, Low Latency) | Scalable, high availability apps (e.g., social media, logs) |
| **PostgreSQL** | **CP** | **PC/EC** (Consistency, Strong Consistency) | Financial apps, banking, critical systems |

---

# **📌 Next Steps**
🚀 **Want to simulate a real network failure?**  
- **Disconnect MongoDB/PostgreSQL manually** (`docker network disconnect`) and observe their behavior!  
- **Try running a distributed database like CockroachDB (NewSQL CP model).**  

---

### **💡 What’s Next?**
Tomorrow, we'll dive into **"Event-Driven Architecture (EDA) with Kafka & RabbitMQ"**.  
Do you want a **Kafka hands-on guide** next? 🚀