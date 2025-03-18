const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "test",
    password: "pappukrs",
    port: 5432,
});

async function run() {
    await client.connect();

    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            age INT
        )
    `);

    await client.query("INSERT INTO users (name, age) VALUES ($1, $2)", ["Bob", 30]);

    const result = await client.query("SELECT * FROM users");
    console.log("📌 PostgreSQL - Users:", result.rows);

    await client.end();
}

run();