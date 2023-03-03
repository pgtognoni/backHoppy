const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated')
const Post = require('../models/Post.model')
const Comment = require('../models/Comment.model')

// Get all posts
router.get("/",async (req, res) => {
    try{
        const posts = await Post.find()
        res.json(posts); 

    }catch(err){
        console.log(err)
    }
})
// Get a single post
router.get("/:postId", async (req, res) => {
    try{
       const postId = req.params.postId;
       const post = await Post.findById(postId).populate("comments")
       res.json(post);

    }catch(err){
        console.log(err)
    }
})
// Create a new post
router.post("/new",async (req, res) => {
    try{
        const body = {...req.body};
        const newPost = await Post.create(body);
        res.status(201).json(newPost);
    }catch(err){
        console.log(err)
    }
})

// Update a post
router.put("/:postId/update",async (req, res) => {
    try{
        const body = {...req.body};
        const postId = req.params.postId;
       const updatedPost = await Post.findByIdAndUpdate(postId, body, {new:true});
       res.json({message:"Post updated successfully",updatedPost});
    }catch(err){
        console.log(err)
    }
})
// Delete a post
router.delete("/:postId/delete",async (req, res) => {
    try{
        const postId = req.params.postId;
       const deletedPost = await Post.findByIdAnddelete(postId, body, {new:true});
       res.json({message:"Post deleted",deletedPost});

    }catch(err){
        console.log(err)
    }
})

module.exports = router;
