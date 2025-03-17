## 📅 **Day 4: Caching - Making Apps Faster** 🚀  

Caching is a critical technique for improving application **performance** and **reducing latency** by storing frequently accessed data.  

---

## **⚡ What is Caching?**  
Caching stores frequently requested data in **memory** to minimize database queries and **accelerate responses**.

### **🔹 Benefits of Caching**
✅ **Faster response times** (No need to query DB every time).  
✅ **Reduces server load** (Fewer requests to backend services).  
✅ **Scales applications better** (Handles more requests efficiently).  

---

## **🛠 Types of Caching**
### 1️⃣ **CDN Caching**  
   - **Use Case:** Storing static assets (images, CSS, JS).  
   - **Examples:** Cloudflare, AWS CloudFront, Akamai.  

### 2️⃣ **Application Caching**  
   - **Use Case:** Storing computed results or API responses.  
   - **Examples:** Redis, Memcached.  

### 3️⃣ **Database Caching**  
   - **Use Case:** Storing database query results to prevent repetitive queries.  
   - **Examples:** MySQL Query Cache, PostgreSQL Cache.  

---

## **🚀 Cache Invalidation Strategies**
Since cached data **becomes stale**, we need methods to **invalidate** (remove) outdated data.

### **1️⃣ Time-based Expiration (TTL)**
   - Cache **expires after a specific time** (e.g., 10 minutes).  
   - **Example:** Set Redis cache to expire in 600 seconds.  
   ```js
   client.setex("key", 600, "value");
   ```

### **2️⃣ Write-through Cache**
   - Data is **stored in the cache & database at the same time**.  
   - **Ensures cache is always up to date** but **slightly slower**.  
   - **Example:** When inserting/updating a database, also update Redis.

### **3️⃣ Lazy Loading**
   - Cache is **updated only when data is requested**.  
   - **Pros:** Reduces unnecessary writes to cache.  
   - **Cons:** First request after expiration is **slow**.  

---

## **🔍 Activity: Install Redis & Set Up Caching in Node.js**
We'll create a simple **Express API** and **cache responses using Redis**.

---

## **🛠 Step 1: Install Redis**
🔥 **For Ubuntu/Linux:**  
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis
```
🔥 **For macOS (Homebrew):**  
```bash
brew install redis
```
🔥 **For Windows:**  
- Download **Redis** from [Redis Windows](https://github.com/microsoftarchive/redis/releases)  
- Start Redis using:  
  ```bash
  redis-server
  ```

---

## **🛠 Step 2: Install Node.js & Required Packages**
Install **Express** and **Redis client**:  
```bash
npm init -y
npm install express redis
```

---

## **🛠 Step 3: Create an Express API with Redis Caching**
📍 **Create `server.js`**
```js
const express = require("express");
const redis = require("redis");

const app = express();
const client = redis.createClient();

client.on("error", (err) => console.error("Redis error:", err));

const fetchData = async (req, res, next) => {
    const key = "data";
    
    // Check Redis cache
    client.get(key, (err, cachedData) => {
        if (cachedData) {
            console.log("Cache Hit ✅");
            return res.json({ source: "cache", data: JSON.parse(cachedData) });
        }

        console.log("Cache Miss ❌ Fetching from DB...");
        const data = { message: "Hello, Caching World!" };

        // Store in Redis with expiration time (TTL = 10 sec)
        client.setex(key, 10, JSON.stringify(data));

        res.json({ source: "database", data });
    });
};

app.get("/data", fetchData);

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## **🛠 Step 4: Run the Redis-backed API**
1️⃣ **Start Redis Server**  
```bash
redis-server
```
2️⃣ **Run the Node.js App**  
```bash
node server.js
```
3️⃣ **Test the API**  
Open a browser or **use cURL**:  
```bash
curl http://localhost:3000/data
```

---

## **🎯 How It Works**
✅ **First request** → Data comes from DB (**Cache Miss ❌**)  
✅ **Subsequent requests** → Data comes from Redis (**Cache Hit ✅**)  
✅ **After 10 seconds (TTL expires)** → Cache resets (**New Cache Miss ❌**)  

---

## **🛠 Step 5: Dockerizing the Redis-Backed App**
📍 **Create `Dockerfile`**
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY server.js .
CMD ["node", "server.js"]
EXPOSE 3000
```

📍 **Create `docker-compose.yml`**
```yaml
version: "3.8"
services:
  redis:
    image: redis:latest
    container_name: redis-cache
    ports:
      - "6379:6379"

  app:
    build: .
    container_name: node-app
    ports:
      - "3000:3000"
    depends_on:
      - redis
```

🔥 **Run everything using Docker Compose**  
```bash
docker-compose up --build
```
Now Redis and the Node.js app run in **separate containers**!

---

## **🎯 Summary**
✅ **Redis improves API speed by caching responses.**  
✅ **Reduces DB calls, making apps more scalable.**  
✅ **Dockerized Redis & Node.js for easy deployment.**  

---

### **🔥 Next Step:**  
Do you want to explore **Redis Pub/Sub for real-time notifications** or **Redis Streams for event-driven architectures**? 🚀