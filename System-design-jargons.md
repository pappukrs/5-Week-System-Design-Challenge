# System Design Jargons

System design involves several key concepts and terms that describe how a system behaves, scales, and meets user expectations. Below is a list of the most common jargons used in system design, explained in a clear and concise way.

## 1. Latency
- **Definition**: The time it takes for a request to be processed and a response to be returned.
- **Example**: If it takes 200 milliseconds for a user to see available movie seats after clicking "Check Availability" on BookMyShow, that's the latency.
- **Importance**: Lower latency means a faster, more responsive system. Critical for user experience.

## 2. Throughput
- **Definition**: The number of requests a system can handle per unit of time (e.g., requests per second).
- **Example**: If BookMyShow can process 10,000 ticket bookings per second during a movie launch, that's its throughput.
- **Importance**: High throughput is essential for handling large-scale traffic, especially during peak events.

## 3. Availability
- **Definition**: The percentage of time a system is operational and accessible to users.
- **Example**: A 99.9% availability means the system is down for no more than 8.76 hours per year (often called "three nines").
- **Importance**: High availability ensures users can always access the service (e.g., booking tickets anytime).

## 4. Consistency
- **Definition**: The guarantee that all users see the same data at the same time across the system.
- **Example**: If two users try to book the same seat on BookMyShow, consistency ensures it's not double-booked.
- **Types**:
  - **Strong Consistency**: Updates are immediately visible to all (e.g., seat locked instantly).
  - **Eventual Consistency**: Updates propagate over time (e.g., reviews might not sync instantly).
- **Importance**: Critical for transactional systems like bookings or payments.

## 5. Scalability
- **Definition**: The ability of a system to handle increased load by adding resources.
- **Types**:
  - **Vertical Scaling**: Adding more power to a single server (e.g., more CPU/RAM).
  - **Horizontal Scaling**: Adding more servers to distribute the load.
- **Example**: BookMyShow adds more servers during a ticket sale rush.
- **Importance**: Ensures the system grows with demand.

## 6. Reliability
- **Definition**: The ability of a system to function correctly even under failures or unexpected conditions.
- **Example**: If a server crashes, BookMyShow should still process bookings using backup servers.
- **Importance**: Ensures trust and uninterrupted service.

## 7. Fault Tolerance
- **Definition**: The system's ability to continue operating despite failures (e.g., hardware crash, network outage).
- **Example**: If one payment gateway fails, BookMyShow switches to another.
- **Importance**: Prevents complete outages and maintains user experience.

## 8. Redundancy
- **Definition**: Duplicating critical components to avoid failure.
- **Example**: Storing booking data in multiple databases across regions.
- **Importance**: Increases reliability and fault tolerance.

## 9. Partition Tolerance
- **Definition**: The system's ability to function even if network partitions (communication breakdowns) occur between nodes.
- **Example**: If BookMyShow's servers in Mumbai lose connection to Delhi, both regions can still process local bookings.
- **Importance**: Part of the CAP theorem (see below).

## 10. CAP Theorem
- **Definition**: A principle stating that a distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition Tolerance.
- **Example**: BookMyShow might prioritize availability (users can book) and partition tolerance over immediate consistency (seat updates might lag slightly).
- **Importance**: Guides trade-offs in distributed system design.

## 11. Load Balancing
- **Definition**: Distributing incoming traffic across multiple servers to avoid overloading any single one.
- **Example**: A load balancer directs users to the least busy server when they access BookMyShow.
- **Importance**: Improves throughput and reduces latency.

## 12. Caching
- **Definition**: Storing frequently accessed data in fast memory to reduce retrieval time.
- **Example**: BookMyShow caches movie showtimes in Redis so they load instantly.
- **Importance**: Boosts performance and reduces database load.

## 13. Concurrency
- **Definition**: Managing multiple operations happening at the same time.
- **Example**: Multiple users trying to book the same seat simultaneously on BookMyShow.
- **Importance**: Ensures data integrity (e.g., no double-booking).

## 14. Idempotency
- **Definition**: Ensuring that repeating an operation produces the same result as doing it once.
- **Example**: If a payment request fails and is retried, the user isn't charged twice.
- **Importance**: Prevents duplicate actions in unreliable networks.

## 15. Sharding
- **Definition**: Splitting a database into smaller, independent pieces (shards) based on a key (e.g., user ID, region).
- **Example**: BookMyShow shards booking data by city to distribute load.
- **Importance**: Improves scalability and performance.

## 16. Replication
- **Definition**: Copying data across multiple servers or regions.
- **Example**: Replicating event data across BookMyShow's servers in India and Singapore.
- **Types**:
  - **Master-Slave**: One primary server writes, others read.
  - **Multi-Master**: Multiple servers can write.
- **Importance**: Enhances availability and fault tolerance.

## 17. Eventual Consistency
- **Definition**: A model where data updates propagate gradually, and all nodes eventually align.
- **Example**: A user's review of a movie might not appear instantly for all users on BookMyShow.
- **Importance**: Balances availability with relaxed consistency needs.

## 18. Backpressure
- **Definition**: A mechanism to slow down or stop incoming requests when the system is overloaded.
- **Example**: BookMyShow queues users during a ticket rush instead of crashing.
- **Importance**: Prevents system failure under heavy load.

## 19. Rate Limiting
- **Definition**: Restricting the number of requests a user or client can make in a time period.
- **Example**: Limiting users to 10 booking attempts per minute to prevent bots.
- **Importance**: Protects the system from abuse or overload.

## 20. SLA (Service Level Agreement)
- **Definition**: A contract defining expected performance (e.g., uptime, latency).
- **Example**: BookMyShow promises 99.95% uptime in its SLA.
- **Importance**: Sets user expectations and accountability.

## 21. Microservices
- **Definition**: Breaking a system into small, independent services that communicate via APIs.
- **Example**: Separate services for bookings, payments, and notifications in BookMyShow.
- **Importance**: Improves scalability, maintainability, and deployment flexibility.

## 22. Monolith
- **Definition**: A single, unified application containing all functionality.
- **Example**: Early versions of BookMyShow might have been a monolith before splitting into microservices.
- **Importance**: Simpler to develop initially but harder to scale.

## Summary Table

| Term          | Meaning                      | Example (BookMyShow)          |
|---------------|------------------------------|-------------------------------|
| Latency       | Time to process a request    | 200ms to load seat map        |
| Throughput    | Requests handled per second  | 10,000 bookings/sec           |
| Availability  | Uptime percentage            | 99.9% uptime                  |
| Consistency   | Same data across system      | No double-booked seats        |
| Scalability   | Handling increased load      | Adding servers for a movie launch |
| Fault Tolerance | Working despite failures   | Backup server takes over      |
| Load Balancing | Distributing traffic        | Users routed to free servers  |
| Caching       | Storing data for quick access| Cached showtimes              |

