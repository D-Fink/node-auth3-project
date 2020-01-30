const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth-token-middleware.js');
const Users = require('./users-model.js');
const secrets = require('../config/secrets.js');

router.post('/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;

    Users.add(user)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json({message: 'error registering username'})
    })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({username})
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
            const token = signToken(user);

            res.status(200).json({
                message: `Welcome ${user.username}`,
                token,
            });
        } else {
            res.status(401).json({message: 'Invalid Credentials'})
        }
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

function signToken(user) {
    const payload = {
        userId: user.id,
        username: user.username
    };

    const options = {
        expiresIn: '1m'
    };
    return jwt.sign(payload, secrets.jwtSecret, options);
};

router.get('/users', auth, (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({message: 'error returning users'})
    })
})

module.exports = router