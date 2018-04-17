const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const SECRETKEY = 'secretkey'

const app = express()

app.use(bodyParser.json())

app.get('/api', (req, res) => {
  res.json({
    message: 'welcome to the API'
  })
})

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, SECRETKEY, (err, data) => {
    const { username } = data.user

    if (err) {
      res.sendStatus(403)
    } else {
      res.json({
        username
      })
    }
  })
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  const user = {
    username,
    password
  }

  jwt.sign({ user }, SECRETKEY, { expiresIn: '50s' }, (err, token) => {
    res.json({
      token
    })
  })
})

// Format of token
// Authorization: Bearer <access_token>

function verifyToken (req, res, next) {
  // Get auth header vaule
  const bearerHeader = req.body.authorization

  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ')
    // Get token from array
    const bearerToken = bearer[1]
    // Set token
    req.token = bearerToken
    // Next middleware
    next()
  } else {
    // Forbidden
    res.sendStatus(403)
  }
}

app.listen(5000, () => {
  console.info(`
    ╔════════════════════════════════╗
    ║                                ║ 
    ║   Server start on port: 5000   ║
    ║                                ║  
    ╚════════════════════════════════╝
  `)
})
