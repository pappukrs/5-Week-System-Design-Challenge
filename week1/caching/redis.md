### **Redis: A Complete Guide**  

**Redis (Remote Dictionary Server)** is an **in-memory data store** known for its **high performance, low latency, and scalability**. It is often used for **caching, session management, real-time analytics, message brokering, and pub/sub systems**.  

---

## **1. Key Features of Redis**
- **In-Memory Storage**: Data is stored in RAM, making operations extremely fast.  
- **Persistence**: Supports **AOF (Append Only File)** and **RDB (Redis Database Backup)** for data durability.  
- **Data Structures**: Supports Strings, Lists, Sets, Hashes, Sorted Sets, and more.  
- **Replication**: Redis supports **Master-Slave replication** for high availability.  
- **Clustering**: Redis Cluster allows sharding and horizontal scaling.  
- **Pub/Sub Messaging**: Supports **real-time communication** between applications.  
- **Transactions**: Uses `MULTI` and `EXEC` commands for atomic operations.  
- **Lua Scripting**: Can execute scripts for complex operations.  

---

## **2. Installation & Setup**
### **Install Redis on Linux (Ubuntu)**
```bash
sudo apt update
sudo apt install redis-server -y
```
### **Start Redis Server**
```bash
redis-server
```
### **Check if Redis is Running**
```bash
redis-cli ping
```
**Output:** `PONG`  

---

## **3. Redis Data Types**
Redis is not just a key-value store; it supports multiple **advanced data structures**.

### **(A) Strings**
Stores text, numbers, or binary data.  
```bash
SET user:name "Alice"
GET user:name
```
### **(B) Lists**
A collection of ordered elements (FIFO).  
```bash
LPUSH queue "Task1" "Task2"
LRANGE queue 0 -1
```
### **(C) Sets**
Stores **unique** values (unordered).  
```bash
SADD fruits "Apple" "Banana" "Apple"
SMEMBERS fruits
```
### **(D) Hashes**
Stores **objects** (field-value pairs).  
```bash
HSET user:100 name "Alice" age 25
HGETALL user:100
```
### **(E) Sorted Sets**
Sorted collection with **scores**.  
```bash
ZADD leaderboard 100 "Alice" 200 "Bob"
ZRANGE leaderboard 0 -1 WITHSCORES
```

---

## **4. Persistence in Redis**
Redis supports **two types of persistence**:  
1. **RDB (Redis Database Backup)**  
   - Takes **snapshots** at intervals.  
   - Uses less disk space but may lose recent changes.  
   - Configured in `redis.conf` with:  
     ```bash
     save 900 1 # Every 900 sec if at least 1 change  
     save 300 10 # Every 300 sec if 10 changes
     ```
2. **AOF (Append-Only File)**  
   - Logs every write operation.  
   - **Safer but slower** than RDB.  
   - Enabled in `redis.conf`:  
     ```bash
     appendonly yes
     ```

---

## **5. Redis Transactions**
Redis supports atomic transactions using `MULTI` and `EXEC`.  
```bash
MULTI
SET user:balance 1000
INCRBY user:balance 500
EXEC
```

---

## **6. Redis Pub/Sub (Real-Time Messaging)**
Redis enables real-time messaging between services.  
### **Publisher (Send Messages)**
```bash
PUBLISH mychannel "Hello Redis!"
```
### **Subscriber (Receive Messages)**
```bash
SUBSCRIBE mychannel
```

---

## **7. Redis Replication (Master-Slave)**
Redis can **replicate data** from a master node to multiple slaves.  
```bash
redis-server --replicaof 192.168.1.10 6379
```
- **Master** handles writes, and **slaves** handle reads.  
- Ensures **high availability**.  

---

## **8. Redis Clustering (Sharding for Scalability)**
Redis **sharding** distributes data across multiple nodes.  
```bash
redis-cli --cluster create 192.168.1.10:6379 192.168.1.11:6379 --cluster-replicas 1
```
- Uses **hash slots (0-16383)** to distribute data across multiple nodes.  
- Provides **horizontal scaling**.  

---

## **9. Redis with Node.js (Practical Example)**
### **Install Redis Client for Node.js**
```bash
npm install ioredis
```
### **Connect to Redis**
```javascript
const Redis = require('ioredis');
const redis = new Redis();

redis.set("user:name", "Alice");
redis.get("user:name", (err, result) => console.log(result)); // Output: Alice
```
### **Use Redis for Caching**
```javascript
app.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const cacheData = await redis.get(`user:${id}`);
    if (cacheData) return res.json(JSON.parse(cacheData));

    const userData = await getUserFromDB(id);
    redis.setex(`user:${id}`, 3600, JSON.stringify(userData)); // Cache for 1 hour
    res.json(userData);
});
```

---

## **10. Redis Security Best Practices**
- **Disable remote access** (bind to localhost).  
- **Enable password authentication** (`requirepass yourpassword` in `redis.conf`).  
- **Use TLS encryption** for secure communication.  
- **Limit client connections** (`maxclients` directive).  

---

### **Final Thoughts**
Redis is a **powerful, in-memory data store** used in caching, pub/sub, and real-time analytics. Its **high speed, rich data structures, and scalability** make it ideal for **modern applications**.  

Would you like a deep dive into **Redis with Node.js** in a real-world use case?