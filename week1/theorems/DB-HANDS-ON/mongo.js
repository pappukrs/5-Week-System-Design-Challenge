const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

const User = mongoose.model("User", userSchema);

async function addUser() {
    await User.create({ name: "Alice", age: 25 });
    console.log("✅ MongoDB - User Added");
}

async function getUsers() {
    const users = await User.find();
    console.log("📌 MongoDB - Users:", users);
}

addUser().then(() => setTimeout(getUsers, 2000));