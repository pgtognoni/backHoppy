const express = require('express');

const router = express.Router();
const Comment = require('../models/Comment.model')
const User = require('../models/User.model')
const Post = require('../models/Post.model')
const Group = require('../models/Group.model')



// Get all comments
// router.get("/",async (req, res, next) => {
//     try{
//         const posts = await Comment.find().populate('user')
//         res.json(posts);  

//     }catch(err){
//         console.log(err)
//     }
// })
// Get a single comment
// router.get("/:commentId", async (req, res) => {
//     try{
//        const commentId = req.params.commentId;
//        const comment = await Comment.findById(commentId).populate('user');
//        res.json(comment);

//     }catch(err){
//         console.log(err)
//     }
// })

// Create a new comment
router.post("/new",async (req, res) => {
    const userId = req.body.user
    const postId = req.body.postId
    const groupId = req.body.groupId
    try{        
        const userInfo = await User.findById(userId)
        const newComment = await Comment.create({user: req.body.user, body: req.body.body, image: userInfo.image[0], username: userInfo.username});
        const user = await User.findByIdAndUpdate(userId, {$push: {commented: postId}})
        const post = await Post.findByIdAndUpdate(postId, {$push: {comments: newComment._id}})
        const group = await Group.findByIdAndUpdate(groupId, {$push: {comments: newComment._id}})
        res.json(newComment);
    }catch(err){
        console.log(err)
    }
})
// Update a comment
// router.put("/:commentId/update",async (req, res) => {
//     try{
//         const body = {...req.body};
//         const commentId = req.params.commentId;
//        const updatedComment = await Post.findByIdAndUpdate(commentId, body, {new:true});
//        res.json({message:"Comment updated successfully",updatedComment});
//     }catch(err){
//         console.log(err)
//     }
// })
// Delete a comment
router.delete("/:commentId/delete",async (req, res) => {
    try{
        const commentId = req.params.commentId;
        const deletedComment = await Comment.findByIdAndDelete(commentId, {new:true});
        res.json({message:"Comment deleted", deletedComment});

    }catch(err){
        console.log(err)
    }
})

module.exports = router;