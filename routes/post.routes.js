const express = require('express');
const router = express.Router();

const Post = require('../models/Post.model')

router.get("/", async (req, res, next) => {
    try{

        const userMatch = await User.findOne(user)
        
        console.log("userMatch....", userMatch)
        const posts = await Post.find()
        res.json(posts);

    }catch(err){
        console.log(err)
    }
})
router.get("/:postId", async (req, res, next) => {
    try{
        const postId = req.params.postId;
        const post = await Post.findById(postId).populate("commented").populate("liked").populate("published")
        res.json(post);

    }catch(err){
        console.log(err)
    }
})
router.post("/new", async (req, res, next) => {
    try{
        const body = req.body;
        const newPost = await Post.create({...body, commented: post._id, liked: liked._id, published: published._id});
        res.json(newPost);

    }catch(err){
        console.log(err)
    }
})

module.exports = router;
