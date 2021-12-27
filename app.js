const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors")
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
// Route for cors
app.use(cors());
app.use(express.json());
// Route for authentication
app.use("/api/auth" , authRoute);
// Route for user
app.use("/api/users",userRoute);
//Route for product
app.use("/api/products" , productRoute);
// Route for cart
app.use("/api/carts" , cartRoute);
// Route for order
app.use("/api/orders" , orderRoute);
// Route for stripe
app.use("/api/checkout" , stripeRoute);

// Listening to ports
app.listen(process.env.PORT || 5000  , () => {
    console.log("Server started successfully");
})


