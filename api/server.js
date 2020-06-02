const express = require('express');

const blogsRouter = require('../data/blogsRouter');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
    <h1>Hello World</h1>
    `);
});

server.use('/api/posts', blogsRouter);

module.exports = server