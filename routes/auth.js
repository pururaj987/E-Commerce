const router = require('express').Router();
const CryptoJS = require('crypto-js');
const User = require("../models/User");
const jwt = require('jsonwebtoken');

router.post("/register" , async (req , res) => {
    const newUser = new User({
        username: req.body.username , 
        email: req.body.email , 
        password: CryptoJS.AES.encrypt(req.body.password , process.env.SEC_KEY).toString()
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch(err) {
        res.status(500).json(err)
    }
})

router.post("/login" , async (req , res) => {
    try {
        const user = await User.findOne({username: req.body.username});

        // Check if user doesn't exist
        !user && res.status(401).json("Wrong credentials");

        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.SEC_KEY);
        const pass = hashedPass.toString(CryptoJS.enc.Utf8);
        
        // Check if password entered is equal to the actual password of the user
        pass !== req.body.password && res.status(401).json("Wrong credentials");

        // If everything matches , then return the user

        const accessToken = jwt.sign(
            {
                id: user._id , 
                isAdmin: user.isAdmin
            } , 
            process.env.JWT_SEC_KEY , 
            {expiresIn: "3d"}
        )

        const {password , ...others} = user._doc
        // Send everything but passsword
        res.status(201).json({...others , accessToken});
    }
    catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;