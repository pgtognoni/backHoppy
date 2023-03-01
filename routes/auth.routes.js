const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const isAuthenticated = require('../middlewares/isAuthenticated')
const User = require('../models/User.model')

router.post('/signup', async (req, res, next) => {
  /* Get back the payload from your request, as it's a POST you can access req.body */
  const body = req.body
  console.log(body)
  try {
    /* Hash the password using bcryptjs */
    const salt = bcrypt.genSaltSync(13)
    const hash = bcrypt.hashSync(body.password, salt)
    /* Record your user to the DB */
    const newUser = await User.create({username: body.username, email: body.email, password: hash})
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
    res.status(200).json({token: authToken})
    }
  } catch (err) {
    console.log(err)
    res.json(err)
  }
})

router.post('/verify',isAuthenticated, async (req, res, next) => {
  // You need to use the middleware there, if the request passes the middleware, it means your token is good
  try {
    if (req.payload) {
      res.json(req.payload.data.username)
    }
  } catch (err) {
    console.log(err.message)
  }
})

module.exports = router
