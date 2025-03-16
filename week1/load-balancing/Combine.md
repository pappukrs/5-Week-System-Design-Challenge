### **📅 Day 3: Load Balancing - Distributing Traffic Efficiently**  

---

## **🚀 What is Load Balancing?**  
Load balancing is a technique used to distribute incoming network traffic across multiple servers, ensuring no single server is overwhelmed. It improves:  

✅ **Scalability** - Handles increasing traffic smoothly  
✅ **High Availability** - Prevents server crashes due to overload  
✅ **Performance Optimization** - Distributes traffic efficiently  

---

## **🌍 Types of Load Balancers**  

### **1️⃣ DNS Load Balancing**
- Distributes traffic at the **DNS level** by returning different server IPs based on geographic proximity or round-robin logic.
- Example: **AWS Route 53, Cloudflare Load Balancer**  

**🛠 How It Works?**  
- User requests `myapp.com` → DNS rotates IPs → Requests are distributed  

**⚠️ Limitation:**  
- Cannot dynamically adjust based on server health.  

---

### **2️⃣ Software Load Balancers**
These are installed on a server and used for routing traffic between multiple backend servers.  

🔹 **Popular Software Load Balancers:**  
- **NGINX** (Reverse Proxy + Load Balancer)  
- **HAProxy** (High-performance Load Balancer)  

**✅ Advantages:**  
✔ Customizable configurations  
✔ Supports different load balancing algorithms  
✔ Monitors server health  

---

### **3️⃣ Hardware Load Balancers**
- **Dedicated network appliances** for traffic distribution.  
- Used by **large enterprises** with high traffic demands.  

🔹 **Examples:**  
- **F5 Big-IP**, **Citrix NetScaler**, **Cisco Load Balancers**  

✅ **Advantages:**  
✔ Super fast and low latency  
✔ Built-in DDoS protection  

❌ **Downside:** Expensive & requires specialized hardware.  

---

## **⚙ Load Balancing Algorithms**
Load balancers use different **algorithms** to decide where to send requests.  

### **1️⃣ Round Robin** (Default)
- **How it Works?**  
  - Distributes requests **sequentially** to all available servers.  
  - Example:  
    ```
    Request 1 → Server A  
    Request 2 → Server B  
    Request 3 → Server C  
    Request 4 → Server A  
    ```
✅ **Good for:** Balanced loads where all servers are equal.  
❌ **Bad for:** Unequal load servers (e.g., one is slower).  

---

### **2️⃣ Least Connections**
- **How it Works?**  
  - Sends traffic to the server with **fewer active connections.**  
✅ **Good for:** Long-lived connections like WebSockets.  
❌ **Bad for:** Short, quick HTTP requests (less useful).  

---

### **3️⃣ IP Hashing**
- **How it Works?**  
  - Routes requests based on the client’s **IP address**.  
  - Ensures the **same user always** hits the same server.  

✅ **Good for:** Sticky sessions & consistent user experience.  
❌ **Bad for:** Load imbalances if one user sends too many requests.  

---

## **🔍 Activity: Set Up an NGINX Load Balancer**  

### **🛠 Step 1: Create Multiple Node.js Servers**  
📍 **Create `server1.js`**  
```js
const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('Hello from Server 1');
});
app.listen(3001, () => console.log('Server 1 running on port 3001'));
```

📍 **Create `server2.js`**  
```js
const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('Hello from Server 2');
});
app.listen(3002, () => console.log('Server 2 running on port 3002'));
```

📍 **Create `server3.js`**  
```js
const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('Hello from Server 3');
});
app.listen(3003, () => console.log('Server 3 running on port 3003'));
```

---

### **🛠 Step 2: Create an NGINX Load Balancer Configuration**
📍 **Create `nginx.conf`**  
```nginx
events {}

http {
    upstream backend_servers {
        server server1:3001;
        server server2:3002;
        server server3:3003;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend_servers;
        }
    }
}
```

---

### **🛠 Step 3: Create a Docker Compose File**
📍 **Create `docker-compose.yml`**  
```yaml
version: '3'

services:
  server1:
    build: ./server1
    ports:
      - "3001:3001"

  server2:
    build: ./server2
    ports:
      - "3002:3002"

  server3:
    build: ./server3
    ports:
      - "3003:3003"

  nginx:
    image: nginx:latest
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
    depends_on:
      - server1
      - server2
      - server3
```

---

### **🛠 Step 4: Run Everything**
1️⃣ **Start the services:**  
```bash
docker-compose up -d
```

2️⃣ **Test Load Balancer:**  
```bash
curl http://localhost
```
➡ You’ll see responses like:  
```
Hello from Server 1
Hello from Server 2
Hello from Server 3
```
🎯 **NGINX is now distributing traffic!**  

---

## **🚀 Conclusion**
✅ **Round Robin is the default algorithm** (works best when servers are equal).  
✅ **Least Connections** is best for **long-lived connections** like WebSockets.  
✅ **IP Hashing** ensures **users always hit the same server** (good for sessions).  

**🛠 Next Steps:**  
🔹 Try different **load balancing algorithms** in `nginx.conf`  
🔹 Set up **Health Checks** to remove failed servers  

---

🔥 **Question:** Want to explore **Load Balancing in Kubernetes** next? 🚀   ### **📅 Day 4: Load Balancing in Kubernetes - Managing Traffic at Scale**  

---

## **🚀 What is Load Balancing in Kubernetes?**  
In Kubernetes, **Load Balancing** ensures that traffic is evenly distributed among multiple pods, improving **scalability, reliability, and high availability**.  

✅ **Automatically distributes requests**  
✅ **Scales based on demand**  
✅ **Handles pod failures seamlessly**  

---

## **🌍 Load Balancing Approaches in Kubernetes**  

### **1️⃣ Internal Load Balancing (ClusterIP - Default)**
- Traffic is only accessible **inside the cluster**.
- No external access.  
- **Use Case:** Communication between microservices inside Kubernetes.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: internal-service
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```
🔥 **Access from another pod:**  
```bash
curl http://internal-service
```

---

### **2️⃣ External Load Balancing (LoadBalancer)**
- Allows external traffic to reach Kubernetes services.
- Uses **Cloud Provider Load Balancer** (AWS, GCP, Azure).  
- **Use Case:** Exposing APIs to external users.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-service
spec:
  type: LoadBalancer
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```
🔥 **Access from the internet:**  
```bash
curl http://EXTERNAL-IP
```
🔍 **Check External IP:**  
```bash
kubectl get svc external-service
```

---

### **3️⃣ Ingress Controller (Layer 7 Load Balancing)**
- Routes traffic based on **URLs, hostnames, or paths**.
- Works as an API Gateway with **NGINX, Traefik, Kong**.
- **Use Case:** Routing traffic to different microservices.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
    - host: myapp.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 80
```
🔥 **Access via domain name:**  
```bash
curl http://myapp.com/api
```
🛠 **Install Ingress Controller:**  
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

---

## **⚙ Load Balancing in Kubernetes Using NGINX**
### **🛠 Step 1: Create a Node.js App**
📍 **Create `server.js`**  
```js
const express = require('express');
const os = require('os');
const app = express();

app.get('/', (req, res) => {
    res.send(`Hello from ${os.hostname()}`);
});

app.listen(3000, () => console.log(`Server running on 3000`));
```

---

### **🛠 Step 2: Create a Dockerfile**
📍 **Create `Dockerfile`**  
```dockerfile
FROM node:18
WORKDIR /app
COPY server.js .
RUN npm install express
CMD ["node", "server.js"]
EXPOSE 3000
```

---

### **🛠 Step 3: Create a Kubernetes Deployment**
📍 **Create `deployment.yaml`**  
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
      - name: node-app
        image: my-node-app
        ports:
        - containerPort: 3000
```
🔥 **Deploy the application:**  
```bash
kubectl apply -f deployment.yaml
```
🛠 **Check Pods:**  
```bash
kubectl get pods
```

---

### **🛠 Step 4: Create a LoadBalancer Service**
📍 **Create `service.yaml`**  
```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-service
spec:
  type: LoadBalancer
  selector:
    app: node-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```
🔥 **Expose the application:**  
```bash
kubectl apply -f service.yaml
```
🛠 **Check External IP:**  
```bash
kubectl get svc node-service
```

---

### **🛠 Step 5: Test the Load Balancer**
🔥 **Make requests and see traffic distributed across pods:**  
```bash
curl http://EXTERNAL-IP
```
➡ You’ll see responses from different **Pods (Servers).**  

---

## **🎯 Conclusion**
✅ **ClusterIP** → For internal communication.  
✅ **LoadBalancer** → Expose services externally.  
✅ **Ingress Controller** → Best for **URL-based routing**.  
✅ **NGINX as Load Balancer** → Handles **traffic distribution efficiently**.  

---

🔥 **Next Step:** Do you want to explore **Auto Scaling in Kubernetes** next? 🚀   ## 📅 **Day 5: Auto Scaling in Kubernetes - Scaling Based on Demand** 🚀  

Auto Scaling in Kubernetes ensures **efficient resource utilization** by dynamically adjusting the number of pods based on CPU, memory, or custom metrics.

---

## **🌍 Types of Auto Scaling in Kubernetes**  

1️⃣ **Horizontal Pod Autoscaler (HPA)**  
   - Scales the number of **Pods** based on CPU/Memory utilization.  
   - **Use Case:** Handling **traffic spikes** dynamically.  

2️⃣ **Vertical Pod Autoscaler (VPA)**  
   - Adjusts **CPU/Memory requests & limits** for existing Pods.  
   - **Use Case:** Optimizing **resource allocation** for performance.

3️⃣ **Cluster Autoscaler**  
   - **Adds/Removes worker nodes** based on pending pod demands.  
   - **Use Case:** Scaling **infrastructure** dynamically in the cloud.

---

## **🛠 Step 1: Create a Node.js App with CPU Load**
📍 **Create `server.js`**  
```js
const express = require('express');
const app = express();

// Simulate CPU load
app.get('/load', (req, res) => {
    let sum = 0;
    for (let i = 0; i < 1e7; i++) sum += i;
    res.send(`Processed heavy load!`);
});

app.get('/', (req, res) => {
    res.send('Hello, this is Kubernetes Auto Scaling!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## **🛠 Step 2: Create a Dockerfile**
📍 **Create `Dockerfile`**  
```dockerfile
FROM node:18
WORKDIR /app
COPY server.js .
RUN npm install express
CMD ["node", "server.js"]
EXPOSE 3000
```
🔥 **Build and push the image to Docker Hub:**  
```bash
docker build -t my-node-app .
docker tag my-node-app <your-docker-hub-username>/my-node-app
docker push <your-docker-hub-username>/my-node-app
```

---

## **🛠 Step 3: Deploy the App in Kubernetes**
📍 **Create `deployment.yaml`**  
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
      - name: node-app
        image: <your-docker-hub-username>/my-node-app
        resources:
          requests:
            cpu: "100m"
          limits:
            cpu: "200m"
        ports:
        - containerPort: 3000
```
🔥 **Deploy it:**  
```bash
kubectl apply -f deployment.yaml
```
🛠 **Check pods:**  
```bash
kubectl get pods
```

---

## **🛠 Step 4: Create a Load Balancer Service**
📍 **Create `service.yaml`**  
```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-service
spec:
  type: LoadBalancer
  selector:
    app: node-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```
🔥 **Expose the service:**  
```bash
kubectl apply -f service.yaml
```
🛠 **Check external IP:**  
```bash
kubectl get svc node-service
```

---

## **🛠 Step 5: Enable Horizontal Pod Autoscaler (HPA)**
📍 **Apply HPA policy**  
```bash
kubectl autoscale deployment node-app --cpu-percent=50 --min=2 --max=5
```
🛠 **Check the HPA status:**  
```bash
kubectl get hpa
```

---

## **🛠 Step 6: Simulate High Traffic & Monitor Scaling**
🔥 **Send multiple requests to overload CPU:**  
```bash
kubectl run -i --tty load-generator --image=busybox --restart=Never -- /bin/sh
```
Inside the BusyBox shell, run:  
```bash
while true; do wget -q -O- http://node-service/load; done
```
🛠 **Watch Pods scaling up dynamically:**  
```bash
kubectl get pods -w
```

---

## **🎯 Summary**
✅ **HPA scales pods based on CPU usage.**  
✅ **Kubernetes automatically adds/removes pods as needed.**  
✅ **Cluster Autoscaler can scale worker nodes for larger loads.**  

---

🔥 **Next Step:** Do you want to explore **Kubernetes Cluster Autoscaler** or **Service Mesh (Istio/Linkerd) for advanced traffic management**? 🚀