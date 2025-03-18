# **📅 Day 13: API Gateway Service Discovery** 🔍🌐  

## **📌 What is Service Discovery?**  
Service Discovery allows an **API Gateway** to automatically detect and route requests to backend services without hardcoding their IP addresses.  

✅ **Why is it Important?**  
🔹 **Dynamic Scaling** – New services are automatically discovered.  
🔹 **Fault Tolerance** – Redirects traffic if a service fails.  
🔹 **Load Balancing** – Spreads traffic across multiple instances.  

## **📌 Types of Service Discovery**  
1️⃣ **Client-Side Discovery** – The client decides which service to contact.  
2️⃣ **Server-Side Discovery** – The API Gateway selects the service dynamically.  

---

# **🔹 1️⃣ Service Discovery with Kong API Gateway**  
### **Step 1: Use Consul for Service Discovery**
📍 **Create `docker-compose.yml`**
```yaml
version: "3.8"
services:
  consul:
    image: consul:latest
    container_name: consul
    ports:
      - "8500:8500"
  
  kong:
    image: kong:latest
    container_name: kong
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: "/usr/local/kong/kong.yml"
    volumes:
      - ./kong.yml:/usr/local/kong/kong.yml
    depends_on:
      - consul
    ports:
      - "8000:8000"
      - "8001:8001"
```

📍 **Start the setup**
```bash
docker-compose up -d
```

---

### **Step 2: Register Services in Consul**  
📍 **Define `service.json`**
```json
{
  "service": {
    "name": "user-service",
    "port": 3000,
    "check": {
      "http": "http://localhost:3000/health",
      "interval": "10s"
    }
  }
}
```
📍 **Register Service**
```bash
curl --request PUT --data @service.json http://localhost:8500/v1/agent/service/register
```
✅ **Now, Kong dynamically discovers `user-service`!**  

---

# **🔹 2️⃣ Service Discovery with AWS API Gateway**  
### **Step 1: Use AWS Cloud Map**  
📍 **Register a Service**  
```bash
aws servicediscovery create-service --name "user-service" --namespace-id "ns-123456"
```
📍 **Register an Instance**  
```bash
aws servicediscovery register-instance --service-id "srv-123456" --instance-id "1" --attributes "AWS_INSTANCE_IPV4=10.0.0.1"
```
✅ AWS API Gateway now dynamically discovers `user-service`.

---

# **🔹 3️⃣ Service Discovery with NGINX API Gateway**  
📍 **Modify `nginx.conf`**
```nginx
http {
    resolver 8.8.8.8 valid=10s;
    
    upstream user_service {
        server user-service.default.svc.cluster.local;
    }

    server {
        listen 80;
        location /users {
            proxy_pass http://user_service;
        }
    }
}
```
✅ NGINX now resolves `user-service` dynamically.

---

# **📌 Summary**  
✅ **Kong API Gateway** → Uses **Consul** for dynamic service discovery.  
✅ **AWS API Gateway** → Uses **AWS Cloud Map** for automatic routing.  
✅ **NGINX API Gateway** → Uses **DNS-based service discovery**.  

🚀 **Next Topic: API Gateway Security?**