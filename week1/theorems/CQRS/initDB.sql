CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id BIGINT UNIQUE NOT NULL,
    product TEXT NOT NULL,
    quantity INT NOT NULL
);