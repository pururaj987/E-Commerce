const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth")

dotenv.config();

// Connection To MongoDB
mongoose
.connect(process.env.MONGO_URL)
.then(() => {
    console.log("DB Connection Successful");
})
.catch((err) => {
    console.log(err);
})

// Making different routes 
app.use(express.json());
// Route for authentication
app.use("/api/auth" , authRoute);
// Route for user
app.use("/api/users",userRoute);

// Listening to ports
app.listen(process.env.PORT || 5000  , () => {
    console.log("Server started successfully");
})


