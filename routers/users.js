const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userSchema')
const jwt = require('jsonwebtoken'); 

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        return res.status(422).json({error: "Please fill all fields"});
    }

    try{
       const userFetched = await User.findOne({email: email});
       
       if(userFetched){
            return res.status(422).json({error: "There already exists an account registered with this email address"});
       }

       const user = new User(req.body);
       await user.save();
       res.status(201).json({message:"Registration successful"});  
    } catch(err) {
        if(err.errors.email){
            console.log(err.errors.email.properties.message);
            res.status(422).json({error: err.errors.email.properties.message});
        }
        else if(err.errors.password){
            console.log(err.errors.password.properties.message);
            res.status(422).json({error: err.errors.password.properties.message});
        }
    }

});

router.post('/signin', async (req,res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(422).json({error: "Please fill all fields."});
        } 
        
        const userFetched = await User.findOne({email:email});
        
        if(userFetched){
            const isMatch = await bcrypt.compare(password,userFetched.password);
            if(!isMatch){
                return res.status(400).json({error: "Invalid email or password"});
            }
            const token = await userFetched.generateAuthToken();
            res.cookie("jwtoken", token, {
                httpOnly: true
            });
            res.status(200).json({message:"Sign In successful"});
        }
        else{
            return res.status(400).json({error: "Invalid email or password"});
        } 

    } catch (err) {
        console.log(err);
    }
});

router.get('/finduser', async (req,res) => {
    try{
        if(!req.cookies) return res.status(400).json();
        const token = req.cookies.jwtoken;
        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({_id:userInfo._id, "tokens.token":token});
        if(!user){
            return res.status(400).json();
        }
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
})

router.get('/signout', async (req, res) => {
    try{
        const token = req.cookies.jwtoken;
        res.clearCookie('jwtoken');
        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({_id:userInfo._id, "tokens.token":token});
        user.tokens = user.tokens.filter(curr => curr.token!==token);
        await user.save();
        res.status(200).json();
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;