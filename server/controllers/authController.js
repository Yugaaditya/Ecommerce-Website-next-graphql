const User = require('../models/userModel');
const Cart= require("../models/cartModel")
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            const hashedPassword = await bcrypt.hash(password,8);
            const newUser = new User({ email, password:hashedPassword });
            const newCart= new Cart({user:newUser._id})
            await newCart.save();
            newUser.cart=newCart._id;
            await newUser.save();
            const token=jwt.sign({_id:newUser._id},process.env.JWT_PASS,{
                expiresIn:"1h"
            })
            return res.status(200).json({token, message: 'User registration successful!' });
        }
        
        const isPasswordMatch= await bcrypt.compare(password,user.password)
        if (!isPasswordMatch){
            return res.status(401).json({ message: 'Wrong user credentials!' });
        }
        else {
            const token=jwt.sign({_id:user._id},process.env.JWT_PASS,{
                expiresIn:"1h"
            })
            return res.status(200).json({token, message: 'Login successful!' });
        }

        

        } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    login,
};
