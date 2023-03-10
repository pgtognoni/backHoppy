const express = require('express');
const router = express.Router();
const Post = require('../models/Post.model');
const Group = require('../models/Group.model');


router.get('/posts/:section', async (req, res) => {
    const filter = req.params.section;
    filter.toLowerCase();
    console.log(filter);
    try {
        const posts = await Post.find({'section': filter, 'group': 'FALSE'}).populate('comments').populate("createdBy").sort({createdAt:-1});
        console.log(posts);
        if (posts.length > 0) {
            res.status(200).json({ posts });
        } else {
            res.status(200).json({ message: 'Try another category' });
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/groups/:section', async (req, res) => {
    const filter = req.params.section;
    filter.toLowerCase();
    try {
        const data = await Group.find({'section': filter}).sort({createdAt:-1});
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(200).json({ message: 'No groups found' });
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/groups/tag/:tag', async (req, res) => {
    const filter = req.params.tag;
    filter.toLowerCase();
    try {
        const data = await Group.find({'tags': filter});
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(200).json({ message: 'No groups found' });
        }
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;