const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated')
const Post = require('../models/Post.model')
const Comment = require('../models/Comment.model')
const User = require('../models/User.model')
const Group = require('../models/Group.model')

// Get all posts
router.get("/",async (req, res) => {
    try{
        const posts = await Post.find().populate('comments').populate("createdBy")
        res.json(posts); 
    }catch(err){
        console.log(err)
    }
})

// Get a single post
router.get("/:postId", async (req, res) => {
    try{
       const postId = req.params.postId;
       const post = await Post.findById(postId)
       res.json(post);
    }catch(err){
        console.log(err)
    }
})
// Create a new post
router.post("/new",async (req, res) => {
    const userId = req.body.createdBy
    const groupId = req.body.groupId
    try{
        const body = {...req.body};
        const newPost = await Post.create(body);
        const user = await User.findByIdAndUpdate(userId, {$push: {published: newPost._id}})
        const group = await Group.findByIdAndUpdate(groupId, {$push: {posts: newPost._id}})
        res.status(201).json(newPost);
    }catch(err){
        console.log(err)
    }
})

// Update a post
router.put("/:postId/update",async (req, res) => {
    try{
        const body = {...req.body};
        const createdBy = body.data.createdBy[0]
        const status = body.status;
        const data = body.data;
        const postId = req.params.postId;
        const postFound = await Post.findById(postId);
        const userFound = await User.findById(createdBy);
        if (status.status === 'like' && userFound) {
            const updateCurrency = JSON.parse(JSON.stringify(userFound));
            updateCurrency.currency = userFound.currency + 5;
            const updateUser = await User.findByIdAndUpdate(createdBy, {$set: {currency: updateCurrency.currency}}, {new: true});
        }
        if (status.status === 'dislike' && userFound) {
            if (postFound.dislikes > 0 && postFound.dislikes % 5 === 0) {
                const updateCurrency = JSON.parse(JSON.stringify(userFound));
                updateCurrency.currency = userFound.currency - 5;
                const updateUser = await User.findByIdAndUpdate(createdBy, {$set: {currency: updateCurrency.currency}}, {new: true});
            }
        }
       const updatedPost = await Post.findByIdAndUpdate(postId, data, {new:true});
       res.json({message:"Post updated successfully",updatedPost});
    }catch(err){
        console.log(err)
    }
})
// Delete a post
router.delete("/:postId/delete",async (req, res) => {
    try{
        const postId = req.params.postId;
       const deletedPost = await Post.findByIdAnddelete(postId, {new:true});
       res.json({message:"Post deleted",deletedPost});

    }catch(err){
        console.log(err)
    }
})

module.exports = router;
