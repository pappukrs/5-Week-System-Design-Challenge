# 🎭 **System Design: BookMyShow (Movie Ticket Booking System)**
Let's **design** BookMyShow, covering **functional & non-functional requirements**, **architecture**, **database schema**, and **scalability considerations**. 🚀

---

## **1️⃣ Functional Requirements (FRs)**
These define **what the system should do**. 

✅ **User Management**  
- Sign up, login, logout  
- View user profile & booking history  

✅ **Movie & Show Management**  
- List movies, theaters, and show timings  
- Filter movies by city, language, rating, and genre  
- View seat availability  

✅ **Booking & Payment**  
- Select movie, theater, and seats  
- Secure online payment (UPI, Credit Card, Wallet)  
- Generate e-tickets & QR code  

✅ **Notifications & Reminders**  
- SMS/email confirmation  
- Reminders before the movie  

✅ **Offers & Discounts**  
- Apply promo codes & coupons  

---

## **2️⃣ Non-Functional Requirements (NFRs)**
These define **how well the system should perform**. 

✅ **Scalability** → Handle **millions of users** at peak times  
✅ **High Availability** → 99.99% uptime  
✅ **Performance** → Seat booking should be **real-time**  
✅ **Consistency** → Show the latest seat availability  
✅ **Security** → Encrypt user data & payments  
✅ **Fault Tolerance** → The system should not fail if one server crashes  
✅ **Compliance** → Follow PCI DSS for payments  

---

## **3️⃣ High-Level Architecture**
📌 We need a **scalable** & **fault-tolerant** system.

### **📌 System Components**
1️⃣ **API Gateway** → Routes requests to different microservices  
2️⃣ **User Service** → Manages user accounts & profiles  
3️⃣ **Movie Service** → Stores movies, theaters & show details  
4️⃣ **Booking Service** → Handles seat booking & ticket generation  
5️⃣ **Payment Service** → Manages transactions securely  
6️⃣ **Notification Service** → Sends emails, SMS, and push notifications  
7️⃣ **Offers Service** → Applies promo codes & discounts  

### **📌 Tech Stack**
| Component        | Technology |
|-----------------|------------|
| Backend API     | **Node.js + Express / Spring Boot** |
| Frontend       | **React / Next.js / Flutter (for mobile)** |
| Database       | **PostgreSQL / MySQL** (for structured data) |
| Caching        | **Redis** (for fast seat availability checks) |
| Messaging Queue | **RabbitMQ / Kafka** (for async tasks like notifications) |
| Payment Gateway | **Razorpay / Stripe / PayU** |
| Load Balancing | **Nginx / AWS ALB** |
| Authentication | **JWT / OAuth2** |

---

## **4️⃣ Database Schema**
We will use **SQL (PostgreSQL / MySQL)** for relational data storage.

### **📌 Tables**
#### **🟢 Users**
| Column       | Type        | Description |
|-------------|------------|-------------|
| `id`        | INT (PK)    | Unique user ID |
| `name`      | VARCHAR     | Full name |
| `email`     | VARCHAR     | Unique email |
| `password`  | VARCHAR     | Hashed password |
| `phone`     | VARCHAR     | Mobile number |

#### **🟢 Movies**
| Column       | Type        | Description |
|-------------|------------|-------------|
| `id`        | INT (PK)    | Unique movie ID |
| `name`      | VARCHAR     | Movie name |
| `genre`     | VARCHAR     | Action, Comedy, etc. |
| `language`  | VARCHAR     | Hindi, English, etc. |
| `duration`  | INT         | In minutes |

#### **🟢 Theaters**
| Column       | Type        | Description |
|-------------|------------|-------------|
| `id`        | INT (PK)    | Unique theater ID |
| `name`      | VARCHAR     | Theater name |
| `city`      | VARCHAR     | City location |

#### **🟢 Shows**
| Column       | Type        | Description |
|-------------|------------|-------------|
| `id`        | INT (PK)    | Unique show ID |
| `movie_id`  | INT (FK)    | Movie being shown |
| `theater_id` | INT (FK)   | Theater where it's playing |
| `start_time` | DATETIME    | Show start time |
| `seats_available` | INT   | Remaining seats |

#### **🟢 Bookings**
| Column       | Type        | Description |
|-------------|------------|-------------|
| `id`        | INT (PK)    | Unique booking ID |
| `user_id`   | INT (FK)    | User who booked |
| `show_id`   | INT (FK)    | Show booked |
| `seat_numbers` | JSON     | List of seat numbers |
| `payment_id` | INT (FK)   | Payment transaction ID |

#### **🟢 Payments**
| Column       | Type        | Description |
|-------------|------------|-------------|
| `id`        | INT (PK)    | Unique payment ID |
| `user_id`   | INT (FK)    | User who paid |
| `amount`    | DECIMAL     | Payment amount |
| `status`    | ENUM        | Pending, Success, Failed |

---

## **5️⃣ API Endpoints**
### **📌 User Authentication**
- `POST /api/register` → Register new user  
- `POST /api/login` → Authenticate user  

### **📌 Movies & Shows**
- `GET /api/movies?city=Delhi` → List all movies in a city  
- `GET /api/movies/:id/shows` → List all shows for a movie  
- `GET /api/shows/:id/seats` → Get seat availability  

### **📌 Booking & Payment**
- `POST /api/bookings` → Reserve seats & start payment  
- `POST /api/payments` → Complete payment  

### **📌 Notifications**
- `POST /api/notifications` → Send SMS/email after booking  

---

## **6️⃣ Handling Concurrency in Seat Booking**
🎯 **Problem:** Two users may book the same seat at the same time.  
🎯 **Solution:** Implement **Optimistic Locking** using **Redis & Database Transactions**.

### **📌 Steps to Avoid Double Booking**
1. When a user selects a seat, **lock the seat in Redis** (valid for 5 minutes).  
2. If another user tries to book the same seat → **reject** their request.  
3. Once payment is completed → **confirm the seat in DB**.  
4. If payment fails → **release the seat**.  

---

## **7️⃣ Scalability & Performance Optimizations**
✅ **Database Optimization** → Use **indexes** for fast queries  
✅ **Caching** → Store frequently accessed data in **Redis**  
✅ **Load Balancing** → Use **Nginx / AWS Load Balancer** to distribute traffic  
✅ **Asynchronous Processing** → Use **RabbitMQ / Kafka** for notifications  
✅ **CDN** → Serve images & static content from **CloudFront / Cloudflare**  

---

## **🎯 Final System Architecture**
```
[User] → [API Gateway] → [Microservices]
                          |→ User Service
                          |→ Movie Service
                          |→ Booking Service
                          |→ Payment Service
                          |→ Notification Service
                          |→ Offer Service
[Database: PostgreSQL + Redis]
[Cache: Redis]
[Messaging Queue: Kafka]
[Load Balancer: Nginx]
```

---

## **🔥 Next Steps**
🚀 **Want a hands-on implementation of APIs in Node.js?**  
✅ **Do you need a deep dive into caching & seat locking?**




Let's start with **hands-on API implementation** in **Node.js + Express** for **BookMyShow seat booking**, including:  

✅ **User authentication** (JWT-based)  
✅ **Movie & Show APIs**  
✅ **Seat selection & real-time availability** (Redis for locking)  
✅ **Booking & payment integration**  

---

# **1️⃣ Setup the Node.js Project**
### **Step 1: Initialize Node.js**
```sh
mkdir bookmyshow-backend && cd bookmyshow-backend
npm init -y
```

### **Step 2: Install Dependencies**
```sh
npm install express mongoose dotenv jsonwebtoken bcryptjs cors redis ioredis
```
- `express` → API framework  
- `mongoose` → MongoDB ORM  
- `dotenv` → Manage env variables  
- `jsonwebtoken` → JWT authentication  
- `bcryptjs` → Hashing passwords  
- `cors` → Cross-Origin support  
- `redis & ioredis` → Caching and seat locking  

---

# **2️⃣ Database Schema (MongoDB + Mongoose)**
📌 Define `models/` directory inside the project.  

### **User Model (models/User.js)**
```js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model("User", UserSchema);
```

### **Movie Model (models/Movie.js)**
```js
const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: String,
  language: String,
  genre: String,
  duration: Number,
  shows: [{ type: mongoose.Schema.Types.ObjectId, ref: "Show" }],
});

module.exports = mongoose.model("Movie", MovieSchema);
```

### **Show Model (models/Show.js)**
```js
const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  theater: String,
  date: String,
  time: String,
  seats: [
    {
      seatNumber: String,
      status: { type: String, enum: ["available", "locked", "booked"], default: "available" }
    }
  ],
});

module.exports = mongoose.model("Show", ShowSchema);
```

---

# **3️⃣ Express Server & Authentication**
📌 Create `server.js` and define API routes.

### **server.js**
```js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/bookmyshow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// **User Registration**
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered successfully" });
});

// **User Login**
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user._id }, "SECRET_KEY", { expiresIn: "1h" });
  res.json({ token });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

✅ Now, register & login users using Postman.  

---

# **4️⃣ Fetch Movies & Shows**
### **Routes for Movies & Shows**
📌 Create `routes/movieRoutes.js`
```js
const express = require("express");
const Movie = require("../models/Movie");
const Show = require("../models/Show");

const router = express.Router();

// **Get All Movies**
router.get("/movies", async (req, res) => {
  const movies = await Movie.find().populate("shows");
  res.json(movies);
});

// **Get Shows for a Movie**
router.get("/movies/:movieId/shows", async (req, res) => {
  const shows = await Show.find({ movie: req.params.movieId });
  res.json(shows);
});

module.exports = router;
```

📌 Import this in `server.js`
```js
const movieRoutes = require("./routes/movieRoutes");
app.use("/api", movieRoutes);
```

✅ Now, test:
```
GET /api/movies
GET /api/movies/:movieId/shows
```

---

# **5️⃣ Real-Time Seat Booking (Redis Locking)**
📌 Install Redis dependencies:
```sh
npm install redis ioredis
```

📌 Create **Redis connection** in `config/redis.js`
```js
const Redis = require("ioredis");
const redis = new Redis();

module.exports = redis;
```

📌 Update **routes/bookingRoutes.js**
```js
const express = require("express");
const redis = require("../config/redis");
const Show = require("../models/Show");

const router = express.Router();

// **Lock a Seat**
router.post("/shows/:showId/lock-seat", async (req, res) => {
  const { seatNumber } = req.body;
  const { showId } = req.params;

  const seatLockKey = `show:${showId}:seat:${seatNumber}`;

  // Check if seat is already locked
  const isLocked = await redis.get(seatLockKey);
  if (isLocked) {
    return res.status(400).json({ error: "Seat is already locked" });
  }

  // Lock the seat in Redis for 5 minutes
  await redis.setex(seatLockKey, 300, "locked");
  res.json({ message: "Seat locked successfully" });
});

// **Confirm Booking**
router.post("/shows/:showId/book-seat", async (req, res) => {
  const { seatNumber } = req.body;
  const { showId } = req.params;

  const seatLockKey = `show:${showId}:seat:${seatNumber}`;

  // Ensure seat was locked
  const isLocked = await redis.get(seatLockKey);
  if (!isLocked) {
    return res.status(400).json({ error: "Seat not locked" });
  }

  // Update in MongoDB
  await Show.updateOne(
    { _id: showId, "seats.seatNumber": seatNumber },
    { $set: { "seats.$.status": "booked" } }
  );

  // Remove from Redis
  await redis.del(seatLockKey);

  res.json({ message: "Seat booked successfully" });
});

module.exports = router;
```

📌 Import this in `server.js`
```js
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api", bookingRoutes);
```

✅ **Test seat locking & booking**
1️⃣ `POST /api/shows/:showId/lock-seat` → **Lock seat**  
2️⃣ `POST /api/shows/:showId/book-seat` → **Confirm booking**  

---

# **6️⃣ Next Steps**
🚀 **Want to integrate payments (Razorpay)?**  
✅ **Do you need a frontend (React/Next.js)?**