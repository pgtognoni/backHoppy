const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const isAuthenticated = require('../middlewares/isAuthenticated')
const User = require('../models/User.model')
const Post = require('../models/Post.model')


router.post('/signup', async (req, res, next) => {
  /* Get back the payload from your request, as it's a POST you can access req.body */
  const body = req.body
  console.log(body)
  try {
    /* Hash the password using bcryptjs */
    const salt = bcrypt.genSaltSync(13)
    const hash = bcrypt.hashSync(body.password, salt)
    /* Record your user to the DB */
    const newUser = await User.create({username: body.username, password: hash})
    res.status(201).json({message: 'User Created'})
  } catch (err) {
    console.log(err)
    res.status(500).json(err.message)
  }

})

router.post('/login', async (req, res, next) => {
  /* Get back the payload from your request, as it's a POST you can access req.body */
  const body = req.body
  try {
    /* Try to get your user from the DB */
    const user = await User.findOne({username: body.username})
    /* If your user exists, check if the password is correct */
    if (user && bcrypt.compareSync(body.password, user.password)) {
    /* If your password is correct, sign the JWT using jsonwebtoken */
    const authToken = jwt.sign(
      {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
        data:{ username: user.username}, // Put yhe data of your user in there
      },
      process.env.TOKEN_SECRET,
      {
        algorithm: 'HS256',
      }
    )
    const {password, ...newUser} = user._doc
   
    res.status(200).json({token: authToken, user: newUser})
    }
  } catch (err) {
    console.log(err)
    res.json(err)
  }
})

router.get('/verify',isAuthenticated, async (req, res, next) => {
  // You need to use the middleware there, if the request passes the middleware, it means your token is good
  try {
    if (req.payload) {
      const username = req.payload.data.username
      const user = await User.findOne({username: username})
      const {password, ...newUser} = user._doc
      res.status(200).json({user: newUser})
      }
  } catch (err) {
    console.log(err.message)
  }
})

router.get('/profile', isAuthenticated, async (req, res) => {
    const username = req.payload.data.username
    try {
        //we need to add the populate from the post before returning the user
        const userFound = await User.findOne({ username: username }).populate('commented').populate('liked').populate('published').populate('followers').populate('following')
        let published = userFound.published;
        let liked = userFound.liked;
        let commented = userFound.commented;
        const publishedArr = []
        const likedArr = []
        const commentedArr = []
        const posts = await Promise.all(published.map(async (post) => {
          const populated = await Post.findById(post._id).populate('comments').populate("createdBy")
          publishedArr.push(populated)
        }))
        const likedPosts = await Promise.all(liked.map(async (post) => {
          const populated = await Post.findById(post._id).populate('comments').populate("createdBy")
          if(post.createdBy[0] !== userFound._id) {
            likedArr.push(populated)
          }
        }))
        const commentedPosts = await Promise.all(commented.map(async (post) => {
          const populated = await Post.findById(post._id).populate('comments').populate("createdBy")
          if(post.createdBy[0] !== userFound._id) {
            commentedArr.push(populated)
          }
        }))

        if (publishedArr.length) {
          //user.published = publishedArr;
        } 
        const user = {...userFound}
        user.published = publishedArr
        user.liked = likedArr
        user.commented = commentedArr
        //here we also need to send the user the posts
        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
    }
})

router.put('/profile', isAuthenticated, async (req, res, next) => {
    const body = req.body
    const username = req.payload.data.username
    try { 
        const user = await User.findOneAndUpdate({ username: username }, body, { new: true })
        res.status(200).json(user)
    } catch (error) { 
        console.log(error)
    }
 })

 router.delete('/delete', isAuthenticated, async (req, res, next) => {
    const username = req.payload.data.username
    try {
        await User.findOneAndDelete({ username: username })
        res.status(200).json({message: 'User Deleted'})
    } catch (error) {
        console.log(error)
    }
 })

module.exports = router
