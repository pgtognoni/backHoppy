const express = require('express');
const router = express.Router();
const Post = require('../models/Post.model');


router.get('/:section', async (req, res) => {
    const filter = req.params.section;
    try {
        const data = await Post.find({'section': filter});
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;