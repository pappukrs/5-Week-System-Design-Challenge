### **Day 1: SQL vs. NoSQL - Understanding the Database Landscape**  

#### **What is a Database?**  
A database is a structured system for storing, retrieving, and managing data efficiently. It allows applications to persistently store information in an organized manner.

---

### **Types of Databases**  

#### **SQL Databases (Relational Databases)**  
- Structured data stored in **tables** with rows and columns.  
- Uses **SQL (Structured Query Language)** for queries like `SELECT`, `JOIN`, etc.  
- **ACID compliance** (Atomicity, Consistency, Isolation, Durability) ensures reliable transactions.  
- Best suited for applications that require **data integrity and consistency**.  
- **Examples:** PostgreSQL, MySQL, MariaDB, SQL Server.  

#### **NoSQL Databases (Non-Relational Databases)**  
- Designed for **flexibility** and **high-performance applications**.  
- Supports **unstructured or semi-structured data** (JSON, XML, key-value, graphs).  
- **BASE model** (Basically Available, Soft state, Eventually consistent) prioritizes speed and scalability.  
- Best suited for applications with **huge data volume and high-speed access**.  
- **Types of NoSQL Databases:**
  - **Document-based:** MongoDB  
  - **Key-Value Store:** Redis  
  - **Wide-Column Store:** Cassandra  
  - **Graph Database:** Neo4j  

---

### **When to Use What?**  

| **Use Case**        | **SQL (Relational)** | **NoSQL (Non-Relational)** |
|---------------------|--------------------|---------------------------|
| **Banking, Transactions**  | ✅ Yes (ACID ensures consistency) | ❌ No (eventual consistency may cause issues) |
| **Social Media, Real-time Apps**  | ❌ No (scalability issues) | ✅ Yes (designed for high traffic) |
| **E-commerce** | ✅ Yes (for structured inventory) | ✅ Yes (for recommendation engines, analytics) |
| **IoT, Big Data**  | ❌ No (scaling is difficult) | ✅ Yes (handles large-scale, high-speed data) |

---

### **🔍 Activity: Install PostgreSQL & MongoDB on Your Local Machine**
#### **Step 1: Install PostgreSQL**
1. **Download & Install PostgreSQL**  
   - Go to [PostgreSQL official site](https://www.postgresql.org/download/)  
   - Download and install for your OS.  
   - During installation, set a password for the `postgres` user.  

2. **Create a Sample Table in PostgreSQL**
   ```sql
   CREATE DATABASE testdb;
   \c testdb;
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(50),
       email VARCHAR(100) UNIQUE
   );
   INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
   SELECT * FROM users;
   ```

---

#### **Step 2: Install MongoDB**
1. **Download & Install MongoDB**  
   - Go to [MongoDB official site](https://www.mongodb.com/try/download/community)  
   - Download and install the Community Edition.  

2. **Create a Sample Document in MongoDB**
   ```js
   use testdb;
   db.users.insertOne({ name: "Alice", email: "alice@example.com" });
   db.users.find().pretty();
   ```

---

### **Next Steps**
✅ **Ensure both PostgreSQL and MongoDB are installed and running**  
✅ **Create sample data in both databases**  
🚀 **Tomorrow: Dive deeper into SQL queries and MongoDB operations!**