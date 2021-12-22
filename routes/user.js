const router = require('express').Router();

module.exports = router;


// These are just for testing purpose
// router.get("/usertest" , (req , res) => {
//     res.send("User test successful");
// })

// router.post("/userposttest" , (req , res) => {
//     const username = req.body.username;
//     res.send(`You are an handsome guy ${username} just like Pururaj`)
// })

// Will work when we go to location like localhost5000:/api/user/usertest
// Test these requests through postman