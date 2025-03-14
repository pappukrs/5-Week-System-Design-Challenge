# 🚀 **Day 2: API Gateway & Its Role in Scalability**  

## **📌 What is an API Gateway?**
An **API Gateway** is a **single entry point** for all client requests. It acts as a **reverse proxy**, managing authentication, rate limiting, logging, and request routing. Instead of calling multiple services separately, clients communicate with **one API Gateway**, which then **forwards requests** to the appropriate microservices.  

---

## **📌 Why Use an API Gateway?**
✅ **Centralized Entry Point** – Clients only need to call **one endpoint**.  
✅ **Security & Authentication** – Protects microservices with **JWT, OAuth, API keys**.  
✅ **Rate Limiting** – Prevents **abuse and DDoS attacks**.  
✅ **Load Balancing** – Spreads requests across multiple instances of a service.  
✅ **Response Aggregation** – Merges responses from multiple microservices into **one**.  
✅ **Caching** – Speeds up responses by storing frequently accessed data.  

---

## **📌 Popular API Gateways**
🔹 **Kong API Gateway** – Open-source, highly scalable.  
🔹 **AWS API Gateway** – Managed service by AWS.  
🔹 **NGINX API Gateway** – Uses Nginx as a reverse proxy.  
🔹 **Express Gateway** – API Gateway written in Node.js.  

---

# **💻 Hands-on Activity: Setting Up Kong API Gateway Locally**
Let's install **Kong API Gateway** and set up a **simple API Gateway** for a **Node.js microservice**.

---

## **Step 1: Install Kong API Gateway**
### **🔹 Using Docker (Recommended)**
Make sure **Docker** is installed, then run:
```sh
docker run -d --name kong-database \
  -p 5432:5432 \
  -e POSTGRES_USER=kong \
  -e POSTGRES_DB=kong \
  postgres:13
```
Now, start **Kong** with:
```sh
docker run -d --name kong \
  --link kong-database \
  -e KONG_DATABASE=postgres \
  -e KONG_PG_HOST=kong-database \
  -e KONG_PROXY_ACCESS_LOG=/dev/stdout \
  -e KONG_ADMIN_ACCESS_LOG=/dev/stdout \
  -e KONG_PROXY_ERROR_LOG=/dev/stderr \
  -e KONG_ADMIN_ERROR_LOG=/dev/stderr \
  -p 8000:8000 -p 8001:8001 \
  kong
```
📌 **Kong is now running on** `http://localhost:8000`.

---

## **Step 2: Create a Node.js Microservice**
Let's create a **basic Express API**.

### **🔹 Install Dependencies**
```sh
mkdir microservice
cd microservice
npm init -y
npm install express
```

### **🔹 Create a Simple API (`server.js`)**
```javascript
const express = require('express');
const app = express();

app.get('/user', (req, res) => {
  res.json({ id: 1, name: 'John Doe', role: 'admin' });
});

app.get('/product', (req, res) => {
  res.json({ id: 101, name: 'Laptop', price: 1500 });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Microservice running on port ${PORT}`));
```
Run the server:
```sh
node server.js
```
✅ Your API is now available at **`http://localhost:3001`**.

---

## **Step 3: Register Service with Kong**
Now, we will **register our microservice with Kong**.

### **🔹 Add the Service**
```sh
curl -i -X POST --url http://localhost:8001/services/ \
  --data 'name=user-service' \
  --data 'url=http://localhost:3001'
```
✅ This tells Kong that **`user-service`** exists at `http://localhost:3001`.

### **🔹 Add a Route**
```sh
curl -i -X POST --url http://localhost:8001/services/user-service/routes \
  --data 'paths[]=/user'
```
✅ Now, Kong will route `/user` requests to our **Express service**.

---

## **Step 4: Test the API Gateway**
Now, access the API via Kong:
```sh
curl -i http://localhost:8000/user
```
✅ Kong forwards the request to **our Express API** (`localhost:3001`).

---

# **🔐 Adding API Key Authentication**
Now, let's secure our API using **API keys**.

### **🔹 Enable Key Authentication**
```sh
curl -i -X POST --url http://localhost:8001/services/user-service/plugins \
  --data 'name=key-auth'
```

### **🔹 Create a Consumer**
```sh
curl -i -X POST --url http://localhost:8001/consumers/ \
  --data "username=test-user"
```

### **🔹 Generate API Key**
```sh
curl -i -X POST --url http://localhost:8001/consumers/test-user/key-auth
```
Output:
```json
{
  "key": "xyz1234apikey"
}
```
### **🔹 Make an Authenticated Request**
```sh
curl -i -X GET --url http://localhost:8000/user --header "apikey: xyz1234apikey"
```
✅ Now, only **authenticated** users can access the API!

---

# **📌 Load Balancing with Kong**
If we have **multiple instances** of our microservice, we can use Kong for **load balancing**.

### **🔹 Add Multiple Instances**
Register **multiple upstream services**:
```sh
curl -i -X POST --url http://localhost:8001/upstreams/ \
  --data "name=user-service-upstream"
```

Now, add **backend nodes**:
```sh
curl -i -X POST --url http://localhost:8001/upstreams/user-service-upstream/targets \
  --data "target=localhost:3001" --data "weight=100"

curl -i -X POST --url http://localhost:8001/upstreams/user-service-upstream/targets \
  --data "target=localhost:3002" --data "weight=100"
```
✅ Kong will **distribute traffic** between `localhost:3001` and `localhost:3002`.

---

# **📌 Summary**
✅ **API Gateway is essential for scaling microservices**.  
✅ **Kong API Gateway handles routing, authentication, and load balancing**.  
✅ **We registered a microservice & secured it with API keys**.  
✅ **Load balancing distributes requests across multiple instances**.  

Would you like to explore **GraphQL with an API Gateway** next? 🚀






Let's analyze what we've covered about **API Gateway** and identify any missing points.  

---

### ✅ **Topics Covered:**  
✔ **Definition of API Gateway** – Acts as a **single entry point** for clients.  
✔ **Why Use API Gateway?** – Security, rate limiting, load balancing, etc.  
✔ **Popular API Gateways** – Kong, AWS API Gateway, NGINX, Express Gateway.  
✔ **Hands-on Kong API Gateway Setup** – Using Docker to set up Kong.  
✔ **Registering Services & Routing Requests** – Configuring Kong to forward traffic.  
✔ **Authentication with API Keys** – Securing the API using key authentication.  
✔ **Load Balancing** – Distributing requests to multiple instances.  

---

### ❌ **Missing or Additional Topics to Cover**  

1️⃣ **Rate Limiting & Throttling**  
   - We mentioned rate limiting but didn't implement it.  
   - Should we set up **rate-limiting plugins** in Kong?  

2️⃣ **Caching API Responses**  
   - API Gateways **cache frequent responses** to improve speed.  
   - Should we add an **example of caching** in Kong?  

3️⃣ **Monitoring & Logging**  
   - Kong provides logs & metrics for API monitoring.  
   - Should we explore **logging with Prometheus/Grafana**?  

4️⃣ **Service Discovery**  
   - API Gateways work with **dynamic services** in Kubernetes.  
   - Should we discuss **service discovery** (e.g., with Consul or Eureka)?  

5️⃣ **GraphQL & API Gateway**  
   - API Gateways can handle **GraphQL queries** efficiently.  
   - Should we integrate **GraphQL with Kong**?  

6️⃣ **WebSockets & API Gateway**  
   - Some Gateways support **WebSocket connections**.  
   - Should we explore **real-time communication**?  

---

### 🔥 **What do you want to focus on next?**  
1️⃣ **Rate Limiting & Throttling**  
2️⃣ **Caching Responses**  
3️⃣ **Monitoring & Logging**  
4️⃣ **Service Discovery in Kubernetes**  
5️⃣ **GraphQL API Gateway**  
6️⃣ **WebSockets API Gateway**  

Let me know what **deep dive** you want! 🚀