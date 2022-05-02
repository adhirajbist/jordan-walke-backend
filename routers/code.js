const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Code = require('../models/codeSchema')
const jwt = require('jsonwebtoken'); 

router.post('/upload', async (req, res) => {
    //const { code, author } = req.body;
    try{
       const codeFetched = await Code.findOne({code: req.body.code});
       
       if(codeFetched){
            return res.status(422).json({error: "This code already exists in database"});
       }

       const code = new Code(req.body);
       await code.save();
       res.status(201).json({message:"Upload successful"});  
    } catch(err) {
        console.log(err);
    }

});

router.post('/uploads', async (req, res) => {
    try{
        const allCodes = await Code.find({authorId:req.body.authorId});
        res.status(200).json(allCodes);
    } catch (err) {
        console.log(err);
    }
})

router.post('/deleteupload', async (req, res) => {
    try{
        await Code.deleteOne({_id: req.body.codeId});
        res.status(200).json();
    } catch(err) {
        console.log(err);
    }
})

router.post('/changestatus', async (req, res) => {
    try{
        await Code.updateOne({_id: req.body.codeId},{status: "approved"});
        res.status(200).json();
    } catch(err) {
        console.log(err);
    }
})

router.post('/populate', async (req, res) => {
    try{
        const status = (req.body.isAdmin? "submitted" : "approved")
        const allCodes = await Code.find({status:status});
        res.status(200).json(allCodes);
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;