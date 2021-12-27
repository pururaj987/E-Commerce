const User = require('../models/User');
const { verifyToken, verifyTokenAndAuth , verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

// Updating the user
router.put("/:id" , verifyTokenAndAuth , async (req , res) => {
    if(req.body.password) {
        req.body.password = 
        CryptoJS.AES.encrypt(req.body.password , process.env.SEC_KEY).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id , 
            {
                $set: req.body
            } , {
                new: true
            } 
        );
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json(err);
    }
});

// Deleting the user
router.delete("/:id" , verifyTokenAndAuth , async(req , res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...")
    } catch(err) {
        res.status(500).json(err);
    }
})


//Getting the stats of users
router.get("/stats" , verifyTokenAndAdmin , async(req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
    try {
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}} , 
            {
                $project: {
                    month: {$month: "$createdAt"}
                }
            } , 
            {
                $group: {
                    _id: "$month" , 
                    total: {$sum: 1}
                }
            }
        ]);
        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }
});

//Getting the user
// Only admin can get the user
router.get("/find/:id" , verifyTokenAndAdmin , async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password , ...others} = user._doc
        // Send everything but passsword
        res.status(201).json({...others});
    } catch(err) {
        res.status(500).json(err);
    }
});

//Getting all users
router.get("/" , verifyTokenAndAdmin , async(req, res) => {
    // Issuing a query
    const query = req.query.new;
    try {
        const users = query
        ? await User.find().sort({_id: -1}).limit(5)
        : await User.find();
        res.status(201).json(users);
    } catch(err) {
        res.status(500).json(err);
    }
});

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