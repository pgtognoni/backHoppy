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
    try {
        const user = await User.findById(body.createdBy)
        const username = user.username;
        const image = user.image[0];
        const group = await Group.create({...body, createdByImg: image, createdByName: username})
        res.status(201).json(group)
    } catch (err) {
        console.log(err)
    }
})

router.get("/:id", isAuthenticated, async (req, res) => {
    const id = req.params.id;
    const username = req.payload.data.username
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

        const populateMembers = () => {
            members.map(async (id) => {
                const userFound = await User.findById(id)
                membersArr.push(userFound)
            })
        }
        const populatePosts= () => {
            posts.map(async (id) => {
                const postFound = await Post.findById(id).populate('createdBy').populate('comments').sort({createdAt:-1})
                postsArr.push(postFound)
            })
        }

        const populateAll = await Promise.all([populateMembers, populatePosts])
        
        const group = {...groupFound}
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