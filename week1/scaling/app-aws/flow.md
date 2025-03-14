# **Scaling a Node.js App with AWS Auto Scaling**

AWS Auto Scaling allows your **Node.js app** to scale dynamically based on traffic by launching multiple EC2 instances. The **AWS Load Balancer** distributes traffic across instances to handle high availability. 🚀

---

## **📌 Step 1: Launch EC2 Instances**
You need at least **one EC2 instance** to deploy the Node.js application.

1. **Go to AWS EC2 Console** → Click **Launch Instance**
2. **Select Amazon Machine Image (AMI)** (Choose Ubuntu 20.04 or Amazon Linux 2)
3. **Choose Instance Type** (e.g., `t2.micro` for free tier)
4. **Configure Security Group**:
   - Allow `HTTP (80)` and `HTTPS (443)`
   - Allow `Custom TCP (3000)` for the Node.js app
   - Allow `SSH (22)` for remote access
5. **Launch and Connect** to the instance using SSH:
   ```sh
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

---

## **📌 Step 2: Install Node.js and Deploy the App**
Once inside the EC2 instance, install Node.js and deploy the application.

### **1️⃣ Install Node.js & Git**
```sh
sudo apt update
sudo apt install -y nodejs npm git
```

### **2️⃣ Clone Your App**
```sh
git clone https://github.com/your-repo/app-aws.git
cd app-aws
```

### **3️⃣ Install Dependencies & Start App**
```sh
npm install
node server.js
```

---

## **📌 Step 3: Install AWS CLI & Auto Scaling Tools**
AWS CLI is required to set up Auto Scaling.

```sh
sudo apt install awscli -y
```

Verify installation:
```sh
aws --version
```

Login to AWS:
```sh
aws configure
```
- Enter your **AWS Access Key ID**
- Enter your **AWS Secret Access Key**
- Set **Region** (e.g., `us-east-1`)
- Default output: `json`

---

## **📌 Step 4: Create an Auto Scaling Launch Template**
A **Launch Template** defines how new EC2 instances will be created.

```sh
aws ec2 create-launch-template \
    --launch-template-name node-template \
    --image-id ami-12345678  \  # Replace with your AMI ID
    --instance-type t2.micro
```

---

## **📌 Step 5: Create an Auto Scaling Group**
An **Auto Scaling Group (ASG)** manages multiple instances.

```sh
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name node-group \
    --launch-template LaunchTemplateName=node-template,Version=1 \
    --min-size 1 --max-size 5 --desired-capacity 3 \
    --availability-zones us-east-1a
```
- **min-size**: Minimum number of instances (1)
- **max-size**: Maximum number of instances (5)
- **desired-capacity**: Initial number of running instances (3)

---

## **📌 Step 6: Attach a Load Balancer**
A **Load Balancer (ALB)** distributes traffic across EC2 instances.

```sh
aws elbv2 create-load-balancer \
    --name node-balancer \
    --type application \
    --subnets subnet-12345678  # Replace with your subnet ID
```

Get the Load Balancer **DNS Name**:
```sh
aws elbv2 describe-load-balancers
```
Use the DNS name to **access the app** in a browser.

---

## **📌 Step 7: Set Up Auto Scaling Policies**
Define when AWS should scale **up or down** based on **CPU usage**.

```sh
aws autoscaling put-scaling-policy \
    --auto-scaling-group-name node-group \
    --policy-name scale-up \
    --adjustment-type ChangeInCapacity \
    --scaling-adjustment 1 \
    --cooldown 60
```
- **Adds 1 instance** if CPU usage is high.

```sh
aws autoscaling put-scaling-policy \
    --auto-scaling-group-name node-group \
    --policy-name scale-down \
    --adjustment-type ChangeInCapacity \
    --scaling-adjustment -1 \
    --cooldown 120
```
- **Removes 1 instance** if CPU usage drops.

---

## **📌 Step 8: Monitor Scaling Events**
Check running instances:
```sh
aws autoscaling describe-auto-scaling-groups
```

Check scaling activity:
```sh
aws autoscaling describe-scaling-activities
```

---

## **✅ Summary**
- **Auto Scaling Group**: Manages multiple EC2 instances.
- **Load Balancer**: Distributes traffic.
- **Scaling Policies**: Add/remove instances based on traffic.

Would you like to **automate deployments with AWS CodeDeploy** or **use ECS with Fargate**? 🚀