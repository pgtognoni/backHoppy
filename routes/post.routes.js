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
        const posts = await Post.find({'group': 'FALSE'}).populate('comments').populate("createdBy").sort({createdAt:-1})
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
    console.log(req.body)
    try{
        const body = {...req.body};
        const newPost = await Post.create(body);
        const user = await User.findByIdAndUpdate(userId, {$push: {published: newPost._id}})
        const group = await Group.findByIdAndUpdate(groupId, {$push: {posts: newPost._id}})
        const resPost = await Post.findById(newPost._id).populate('createdBy')
        console.log(resPost)
        res.status(201).json(resPost);
    }catch(err){
        console.log(err)
    }
})

// Update a post
router.put("/:postId/update",async (req, res) => {
    try{
        const body = {...req.body};
        const createdBy = body.data.createdBy[0]
        const data = body.data;
        const postId = req.params.postId;
        const updatedPost = await Post.findByIdAndUpdate(postId, body, {new:true});
        res.json({message:"Post updated successfully",updatedPost});
    }catch(err){
        console.log(err)
    }
})

router.put("/:postId/update/like",async (req, res) => {
    try{
        const body = {...req.body};
        const createdBy = body.data.createdBy
        const data = body.data;
        console.log(data)
        const postId = req.params.postId;
        const userFound = await User.findById(createdBy);
        if (userFound) {
            const updateCurrency = JSON.parse(JSON.stringify(userFound));
            updateCurrency.currency = userFound.currency + 5;
            const updateUser = await User.findByIdAndUpdate(createdBy, {$set: {currency: updateCurrency.currency}}, {new: true});
            console.log(updateUser)
        }
       const updatedPost = await Post.findByIdAndUpdate(postId, data, {new:true});
       res.json({message:"Post updated successfully",updatedPost});
    }catch(err){
        console.log(err)
    }
})

router.put("/:postId/update/dislike",async (req, res) => {
    try{
        const body = {...req.body};
        const createdBy = body.data.createdBy
        const data = body.data;
        const postId = req.params.postId;
        const postFound = await Post.findById(postId);
        const userFound = await User.findById(createdBy);
        if (userFound) {
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
