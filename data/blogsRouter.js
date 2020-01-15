const express = require('express');

const Blogs  = require('../data/db.js');
const router = express.Router();


// GET all posts - /api/posts
router.get('/', (req, res) => {
    Blogs.find(req.query)
    .then(blogs =>{
        res.status(200).json(blogs);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: "The posts information could not be retrieved."});
    });
});

// GET specific post - /api/posts/:id
router.get('/:id', (req, res) => {
    Blogs.findById(req.params.id)
    .then(blogs => {
        const blog = blogs[0]
        if (blog) {
            res.status(200).json(blog);
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist." });
        };
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: "The post information could not be retrieved." });
    });
});


//GET specific post's comments - /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
    Blogs.findPostComments(req.params.id)
    .then(comment => {
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."});
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: "The post information could not be retrieved." });
    });
});

//POST creates new post - /api/posts
router.post('/', (req, res) => {
    const {title, contents} = req.body;

    if(!title || !contents){
    res.status(400).json({
        errorMessage: "Please provide title and contents for the post."});
    };

    Blogs.insert(req.body)
    .then(newBlog =>{
        console.log(newBlog);
      res.status(201).json(newBlog)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: "There was an error while saving the post to the database"});
    });
});

// POST creates new comment for specific id - /api/posts/:id/comments
router.post('/:id/comments', (req, res) => {
    const {text} = req.body;
    const {id} = req.params;

    if(!text){
    res.status(400).json({
        errorMessage: "Please provide text for the comment." 
        });
    };

    if(!id){
        res.status(404).json({
            message: "The post with the specified ID does not exist."});
    }

    Blogs.insertComment(req.params.comment)
    .then(newComment => {
        res.status(201).json(newComment)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        error: "There was an error while saving the comment to the database"});
    });
});

// DELETE Removes the post with the specified id and returns the deleted post object - /api/posts/:id
// (You may need to make additional calls to the database in order to satisfy this requirement.)
router.delete('/:id', (req, res) => {
    Blogs.remove(req.params.id)
    .then(deleted => {
        if(deleted){
            res.status(204).json(deleted);
        } else{
            res.status(404).json({
                message: "The post with the specified ID does not exist."});
        }
    }) 
    .catch(error =>{
        console.log(error);
        res.status(500).json({ 
            error: "The post could not be removed"});
    });
});

//PUT update post for specific id - /api/posts/:id
router.put('/:id', (req, res) =>{
    const id = req.params.id;
    const blogData = req.body;
    const { title, contents } = blogData;

    if(!title || !contents){
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."});
    }
    Blogs.update(id, blogData)
    .then(post =>{
        if(!post.id){
            return res.status(404).json({
                message: "The post with the specified ID does not exist."});
        } else {
            res.status(200).json(post);
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: "The post information could not be modified."});
    })
});

module.exports = router;