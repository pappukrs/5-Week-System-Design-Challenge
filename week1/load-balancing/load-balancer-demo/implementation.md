Here's how your folder structure should look for implementing Load Balancing with Auto Scaling and Kubernetes deployment:

## **📂 Folder Structure**
```
load-balancer-demo/
│── server1/
│   ├── Dockerfile
│   ├── server1.js
│── server2/
│   ├── Dockerfile
│   ├── server2.js
│── server3/
│   ├── Dockerfile
│   ├── server3.js
│── nginx/
│   ├── nginx.conf
│── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│── docker-compose.yml
│── README.md
```

---

## **📌 Step 1: Implement Different Load Balancing Algorithms**
By default, **NGINX** uses **Round Robin**, but we can implement other strategies:

### **🛠 1️⃣ Least Connections**
Modify the **`nginx.conf`** file:
```nginx
http {
    upstream backend_servers {
        least_conn;  # <-- This enables Least Connections Load Balancing
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

### **🛠 2️⃣ IP Hashing**
Modify the **`nginx.conf`** file:
```nginx
http {
    upstream backend_servers {
        ip_hash;  # <-- This enables IP Hashing Load Balancing
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
➡ **IP Hashing ensures** that the same user (IP address) always gets routed to the same backend server.

---

## **📌 Step 2: Implement Auto Scaling**
We'll use **Kubernetes** to auto-scale our backend services.

### **1️⃣ Create a Deployment in `k8s/deployment.yaml`**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
spec:
  replicas: 3  # Start with 3 replicas (auto-scale will adjust this)
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-dockerhub-username/backend:latest
        ports:
        - containerPort: 3000
```

### **2️⃣ Create a Service in `k8s/service.yaml`**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### **3️⃣ Apply Kubernetes Configurations**
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

---

## **📌 Step 3: Configure Kubernetes Auto Scaling**
Run the following command to enable **Auto Scaling**:
```bash
kubectl autoscale deployment backend-deployment --cpu-percent=50 --min=3 --max=10
```
➡ **This will automatically scale** the number of backend servers based on CPU load.

---

## **📌 Step 4: Deploy to Kubernetes**
Now, deploy everything:
```bash
kubectl apply -f k8s/
```
Check if auto-scaling is enabled:
```bash
kubectl get hpa
```

---

## **✅ Final Result**
Now your system:
✅ Uses **Least Connections** or **IP Hashing** for Load Balancing.  
✅ Supports **Auto Scaling** to handle traffic spikes.  
✅ Runs on **Kubernetes** for cloud-native deployment.

🔥 **Want to deploy this to AWS/GCP? Let me know! 🚀**