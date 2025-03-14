Here’s the full setup for **Scaling a Node.js Express Server with Kubernetes**.

---

## **📌 Step 1: Create an Express Server**
### **File: `server.js`**
```javascript
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`Hello from Node.js! Running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## **📌 Step 2: Create a Dockerfile**
### **File: `Dockerfile`**
```dockerfile
# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire app
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
```

---

## **📌 Step 3: Create a Kubernetes Deployment**
### **File: `deployment.yaml`**
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
        image: my-node-app:latest # Replace with your actual image name
        ports:
        - containerPort: 3000
```

---

## **📌 Step 4: Create a Kubernetes Load Balancer**
### **File: `service.yaml`**
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

---

## **📌 Step 5: Build & Deploy with Kubernetes**
### **1️⃣ Build the Docker Image**
```sh
docker build -t my-node-app .
```

### **2️⃣ Push the Image to Docker Hub (Optional)**
```sh
docker tag my-node-app your-dockerhub-username/my-node-app
docker push your-dockerhub-username/my-node-app
```

### **3️⃣ Apply Kubernetes Deployment**
```sh
kubectl apply -f deployment.yaml
```

### **4️⃣ Apply Kubernetes Service**
```sh
kubectl apply -f service.yaml
```

### **5️⃣ Check Pods Running**
```sh
kubectl get pods
```

### **6️⃣ Get the External Load Balancer IP**
```sh
kubectl get services
```
- If using **Minikube**, run:
  ```sh
  minikube service node-service
  ```

---

## **✅ Summary**
Now, **Kubernetes automatically scales** your **Node.js Express app** across multiple replicas and **manages load balancing**.

Would you like to add **auto-scaling (HPA)** or deploy it to **Google Kubernetes Engine (GKE)**? 🚀