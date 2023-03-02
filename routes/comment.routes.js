const express = require('express');

const router = express.Router();
const Comment = require('../models/Post.model')
const Post = require('../models/Post.model')



// Get all comments
router.get("/",async (req, res, next) => {
    try{
        const posts = await Comment.find()
        res.json(posts);  

    }catch(err){
        console.log(err)
    }
})
// Get a single comment
router.get("/:commentId", async (req, res) => {
    try{
       const commentId = req.params.commentId;
       const comment = await Comment.findById(commentId).populate('user');
       res.json(comment);

    }catch(err){
        console.log(err)
    }
})
// Create a new comment
router.post("/new",async (req, res) => {
    try{
        const body = req.body;
       const newComment = await Comment.create(body);
        res.json(newComment);
    }catch(err){
        console.log(err)
    }
})
// Update a comment
router.put("/:commentId/update",async (req, res) => {
    try{
        const body = {...req.body};
        const commentId = req.params.commentId;
       const updatedComment = await Post.findByIdAndUpdate(commentId, body, {new:true});
       res.json({message:"Comment updated successfully",updatedComment});
    }catch(err){
        console.log(err)
    }
})
// Delete a comment
router.delete("/:commentId/delete",async (req, res) => {
    try{
        const commentId = req.params.commentId;
       const deletedComment = await Post.findByIdAnddelete(commentId, body, {new:true});
       res.json({message:"Comment deleted",deletedComment});

    }catch(err){
        console.log(err)
    }
})

module.exports = router;