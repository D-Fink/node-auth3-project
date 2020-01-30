const express = require('express');
const usersRouter = require('./hub/users-router.js')

const server = express();

server.use(express.json());
server.use('/api', usersRouter);

module.exports = server