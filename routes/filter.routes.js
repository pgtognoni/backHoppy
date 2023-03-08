const express = require('express');
const router = express.Router();
const Post = require('../models/Post.model');
const Group = require('../models/Group.model');


router.get('/:section', async (req, res) => {
    const filter = req.params.section;
    filter.toLowerCase();
    try {
        const posts = await Post.find({'section': filter});
        const groups = await Group.find({'section': filter});
        if (posts.length > 0 || groups.length > 0) {
            res.status(200).json({ posts, groups });
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
        const data = await Group.find({'section': filter});
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