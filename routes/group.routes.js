const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated')
const Post = require('../models/Post.model')
const Comment = require('../models/Comment.model')
const User = require('../models/User.model')
const Group = require('../models/Group.model')


router.get("/",async (req, res) => {
    try{
        const groups = await Group.find().populate('comments').populate('posts').populate('members').sort({createdAt:-1})
        res.json(groups); 
    }catch(err){
        console.log(err)
    }
})

router.post("/new", isAuthenticated, async (req, res) => {
    const body = req.body;
    const tags = req.body.tags.toLowerCase().split(' ')
    body.tags = tags
    console.log(body)
    try {
        const user = await User.findById(body.createdBy)
        const username = user.username;
        const image = user.image[0];
        console.log(user.username)
        const group = await Group.create({...body, createdByImg: image, createdByName: username, members: body.createdBy})
        const userUpdate = await User.findByIdAndUpdate({_id: user._id}, {$push: {groups: group._id}})
        res.status(201).json(group)
    } catch (err) {
        console.log(err)
    }
})

router.get("/:id/:userId", async (req, res) => {
    const id = req.params.id;
    const username = req.params.userId
    try {
        const groupFound = await Group.findById(id).populate('members').populate('comments').populate('posts').sort({createdAt:-1})
        if (!groupFound) {
            const user = await User.findOneAndUpdate({ username: username }, {$pull: {groups: id}}, { new: true })
            res.json({ message: 'Group not longer exists'})
        }
        let members = groupFound.members
        let posts = groupFound.posts
        const membersArr = []
        const postsArr = []

        const populatePosts = await Promise.all(posts.map(async (id) => {
            const postFound = await Post.findById(id).populate('createdBy').populate('comments').sort({createdAt:-1})
            postsArr.push(postFound)
        })
        )
        const populateMembers = await Promise.all(members.map(async (id) => {
            const userFound = await User.findById(id)
            membersArr.push(userFound)
        }))
        
        const group = JSON.parse(JSON.stringify(groupFound))
        group.members = membersArr
        group.posts = postsArr

        res.status(200).json({ group })

    } catch (err) {
        console.log(err)
    }
})

router.put("/update/:id", isAuthenticated, async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    try {
        const groupFound = await Group.findByIdAndUpdate(id, body, { new: true })
        res.status(200).json(groupFound)
    } catch (err) {
        console.log(err)
    }
})

router.put("/like/:id", isAuthenticated, async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    try {
        const groupFound = await Group.findByIdAndUpdate(id, {likes: body.likes }, { new: true })
        res.status(200).json(groupFound)
    } catch (err) {
        console.log(err)
    }
})

router.put("/join/:id", isAuthenticated, async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    try {
        const groupFound = await Group.findByIdAndUpdate({_id: id}, {$push: {members: body.data}}, { new: true })
        console.log(groupFound.members)
        res.status(200).json({message: 'Joined group'})
    } catch (err) {
        console.log(err)
    }
})

router.delete("/delete/:id", isAuthenticated, async (req, res) => {
    try{
        const groupId = req.params.id;
       const deletedGroup = await Group.findByIdAnddelete(groupId, {new:true});
       res.json({message:"Group deleted",deletedGroup});

    }catch(err){
        console.log(err)
    }
})
module.exports = router;