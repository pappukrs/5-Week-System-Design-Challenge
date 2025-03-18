# **📅 Day 9: API Rate Limiting & Throttling - Protecting Your APIs** 🚀  

## **📌 Part 1: What is API Rate Limiting?**
API rate limiting **restricts the number of requests** a client can make in a given time.  
It helps **prevent abuse, DDoS attacks, and server overload.**  

### **🔹 Why is it important?**
✅ **Protects servers** from high traffic spikes.  
✅ **Prevents API misuse** (e.g., brute-force attacks).  
✅ **Ensures fair usage** for all users.  

---

## **📌 Part 2: Types of API Rate Limiting**
🔹 **Fixed Window** → Limits requests per fixed time window.  
🔹 **Sliding Window** → Allows a rolling limit over a period.  
🔹 **Token Bucket** → Clients get a fixed number of tokens that refill over time.  
🔹 **Leaky Bucket** → Requests are processed at a fixed rate, like a queue.  

We’ll **implement rate limiting in Node.js** using:  
🔹 **Express Rate Limit** (Simple middleware).  
🔹 **Redis** (Distributed rate limiting for scalable APIs).  
🔹 **NGINX Rate Limiting** (Reverse proxy-based).

---

# **🛠 Part 3: Hands-on Implementation**
We’ll set up **three APIs** using **different rate-limiting strategies**.  

---

## **🔹 1️⃣ Simple Rate Limiting with `express-rate-limit`**
📍 **Install Dependencies**
```bash
npm init -y
npm install express express-rate-limit
```

📍 **Create `server.js`**
```js
const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();
const port = 3000;

// Limit each IP to 5 requests per minute
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, 
    message: "Too many requests, please try again later.",
});

app.use(limiter);

app.get("/", (req, res) => {
    res.send("🚀 API with Rate Limiting Enabled");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
```

### **📌 Test the API**
Run the server:
```bash
node server.js
```
Send multiple requests:
```bash
curl -X GET http://localhost:3000/
```
✅ After **5 requests**, the API **blocks further requests**.  

---

## **🔹 2️⃣ Distributed Rate Limiting with Redis**
📍 **Install Redis & Dependencies**
```bash
npm install redis express-rate-limit rate-limit-redis
docker run --name redis -p 6379:6379 -d redis
```

📍 **Create `server-redis.js`**
```js
const express = require("express");
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const { createClient } = require("redis");

const app = express();
const port = 4000;

// Connect to Redis
const redisClient = createClient({ socket: { host: "localhost", port: 6379 } });
redisClient.connect().catch(console.error);

// Redis-based rate limiter (10 requests per 10 seconds)
const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 10 * 1000, 
    max: 10, 
    message: "Rate limit exceeded! Try again later.",
});

app.use(limiter);

app.get("/", (req, res) => {
    res.send("🚀 API with Redis-based Rate Limiting");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
```

### **📌 Test the API**
Run:
```bash
node server-redis.js
```
Test multiple requests:
```bash
curl -X GET http://localhost:4000/
```
✅ Requests **beyond 10 in 10s** get **blocked**.  

---

## **🔹 3️⃣ NGINX Rate Limiting (Reverse Proxy-Based)**
📍 **Create `nginx.conf`**
```nginx
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;

    server {
        listen 80;
        
        location /api/ {
            limit_req zone=api_limit burst=10 nodelay;
            proxy_pass http://backend;
        }
    }

    upstream backend {
        server backend-service:3000;
    }
}
```

📍 **Create `docker-compose.yml`**
```yaml
version: "3"
services:
  backend:
    image: node:18
    working_dir: /app
    volumes:
      - .:/app
    command: node server.js
    ports:
      - "3000:3000"

  nginx:
    image: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "8080:80"
```

📍 **Run NGINX + Node.js**
```bash
docker-compose up
```

✅ **Requests beyond 5 per second get rate-limited.**  

---

# **📌 Part 4: Summary**
✅ **`express-rate-limit`** → Simple middleware (per instance).  
✅ **Redis-based Rate Limiting** → Scalable, works across multiple servers.  
✅ **NGINX Rate Limiting** → Efficient reverse proxy-based rate limiting.  

---

# **📌 Part 5: Next Steps**
🚀 **Try API Key-based rate limiting** → Different limits for different users.  
🚀 **Implement IP-based rate limiting** → Allowlist trusted IPs.  
🚀 **Next: API Gateway Rate Limiting in Kong & AWS API Gateway**  

Would you like a **deep dive into API Gateway Rate Limiting next?** 🔥