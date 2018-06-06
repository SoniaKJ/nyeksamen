// Load Express framework module
const express = require('express')

// Load express-session to support sessions
const session = require('express-session')

// Load bcrypt for password hashing
const bcrypt = require('bcrypt')

// Load Joi module for validation
const Joi = require('joi')

// Load database config
const db = require('./database.js')

const giphy = require('giphy-api')('rKTdIyLMETSBNOLUIMX1d2zHIG040j5b')

// Make an instance of Express
const app = express()

// Handle JSON requests
app.use(express.json())

// Setup express-session
const expressSession = session({
    secret: 'dogQuiz'
})

// Using the above settings
app.use(expressSession)

// To support real-time features load Socket.io
const server = require('http').Server(app)
const io = require('socket.io')(server)
// Share sessions between Socket.io and Express
const ioSession = require('express-socket.io-session')
// Setup session sharing between Socket.io and Express
io.use(ioSession(expressSession, {
    autoSave: true
}))

// List of users currently connected to the quiz. I didnt do more about this. It could be done in a further work.
let onlineUsers = []

// What to do when a user (socket) connects to the site
io.on('connection', socket => {

    let { user } = socket.handshake.session

    // When a user disconnects
    socket.on('disconnect', () => {
        // Check if the user is logged in
        if (user) {
            // Remove the users from the onlineUsers array. I didnt create a table for online users yet.
            onlineUsers = onlineUsers.filter(u => u.id !== user.id)

            // Emit the new list of online users
            io.emit('online users', onlineUsers)
        }
    })

    // If the user is logged in
    if (user) {
        // Check if the user is already on the list (that I dont have)
        if (!onlineUsers.some(u => u.id == user.id)) {
            // If user is not on the list, add the user
            onlineUsers.push(user)

            // Attach the user to the socket
            socket.user = user
        }
    }

    io.emit('online users', onlineUsers)
})

// Serve public folder
app.use(express.static('public'))

// Authentication middleware
const requireAuthentication = (req, res, next) => {
    if (!req.session.user) {
        return res.json({
            status: 'ERROR',
            message: 'Authentication required!'
        })
    }

    next()
}

// Check if user is logged in if not, redirect to login.html
app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('./login.html')
    }

    console.log("ddd")

    res.sendFile(__dirname + './home.html')
})

// Endpoint to handle user authentication
app.post('/api/auth', (req, res) => {
    let { username, password } = req.body

    let schema = {
        username: Joi.string().alphanum().required(),
        password: Joi.string().required()
    }

    // Using Joi to validate
    let result = Joi.validate(req.body, schema)

    // If validation failed an error is returned
    if (result.error !== null) {
        return res.status(422).json({
            message: 'Invalid request'
        })
    }

    // Build query for looking up the user
    let query = {
        where: {
            username
        }
    }

    db.User.findOne(query)
    .then(user => {
        // Return an error if user was not found
        if (!user) {
            return res.status(422).json({
                status: 'ERROR',
                message: 'Invalid credentials'
            })
        }

        // Compare the found user's password with the submitted password
        // bcrypt encrypts the submitted and stores password
        bcrypt.compare(password, user.password)
        .then(result => {
            // Return an error if the comparison fails
            if (!result) {
                return res.status(422).json({
                    status: 'ERROR',
                    message: 'Invalid credentials'
                })
            }

            req.session.user = {
                id: user.id,
                username: user.username
            }

            res.json({
                status: 'OK',
                message: 'You have been authenticated!'
            })
        })
    })
})

// Endpoint to destroy the session's data
app.get('/api/auth/logout', (req, res) => {
    req.session.destroy()

    res.redirect('./login.js')
})

// Endpoint to register a new user
app.post('/api/users', (req, res) => {
    let { username, password } = req.body

    let schema = {
        username: Joi.string().alphanum().required(),
        password: Joi.string().required()
    }

    const result = Joi.validate(req.body, schema)

    if (result.error !== null) {
        return res.status(422).json({
            status: 'ERROR',
            message: 'Validation failed'
        })
    }

    // Create the new user
    db.User.create({
        username,
        password
    })
    .then(user => {
        // HTTP 201 = Created
        res.status(201).json({
            status: 'OK',
            message: 'User created!'
        })
    })
    .catch(error => {
        res.status(422).json({
            status: 'ERROR',
            message: 'Error creating user!'
        })
    })
})

// Endpoint which returns ALL quiz results and the related user
app.get('/api/quizobjs', (req, res) => {

    let options = {
        include: [{
            model: db.User,
            attributes: ['username']
        }]
    }

    db.Quizobjs.findAll(options)
    .then(quizobjs => {
        res.json(quizobjs)
    })
})

// Endpoint to save new quiz results. Requires that the user is logged in
app.post('/api/quizobjs', requireAuthentication, (req, res) => {
    let { text } = req.body

    let schema = {
        text: Joi.string().required()
    }

    let result = Joi.validate(req.body, schema)

    if (result.error !== null) {
        return res.status(422).json({
            status: 'ERROR',
            message: 'Missing text for message'
        })
    }


    // Create the quiz result and take the userId from the session
    // Adding the userId associates the quiz result to the user
    db.Quizobj.create({
        text,
        userId: req.session.user.id
    }, {
        include: [{
            model: db.User,
            attributes: ['username']
        }]
    })
    .then(quizobj => {
  // Select the quiz result again with the associated user
        return quizobj.reload()
    })
    .then(quizobj => {
  // Emit the newly created quiz result to all sockets
        io.emit('new quizobj', quizobj)

  // Return a HTTP 201 response
        return res.status(201).json({
            status: 'OK',
            message: 'A quiz was just taken!'
        })
    })
    .catch(error => {
        res.status(422).json({
            status: 'ERROR',
            message: 'An error accured when creating the result'
        })
    })
})

app.get('/gif/success', (req, res) => {
  giphy.search('good job', (err, resGiphy) => {
    res.redirect(resGiphy.data[0].source)
  })
})

// Sync models to the database
db.sequelize.sync({ force: true }).then(() => {
    server.listen(3000, () => {
        db.User.create({
            username: 'bot',
            password: 'secret',
        }, {

            include: [ db.Quizobj ]
        })
        console.log('Database is ready and server is running..')
    })
})
