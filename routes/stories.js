const express = require('express')
const passport = require('passport')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')
const router = express.Router()

/**
 * @desc Show add new story page
 * @route GET /stories/add
 */
router.get(
    '/add', ensureAuth,
    (req, res) => {
        res.render('stories/add')
    }
)

/**
 * @desc Process add new story
 * @route POST /stories
 */
 router.post(
    '/', ensureAuth,
    async (req, res) => {
        try {
            req.body.user = req.user.id
            await Story.create(req.body)
            res.redirect('/dashboard')
        } catch (error) {
            console.error(error)
            res.render('error/500')
        }
    }
)

/**
 * @desc Show all public stories
 * @route GET /stories
 */
 router.get(
    '/', ensureAuth,
    async (req, res) => {
        try {
            const stories = await Story.find({ status: 'public' })
                .populate('user')
                .sort({ createdAt: 'desc' })
                .lean()

            res.render('stories/index', {
                stories
            })
        } catch (error) {
            console.error(error)
            res.render('error/500')
        }
    }
)

/**
 * @desc Show a story
 * @route GET /stories/:id
 */
 router.get(
    '/:id', ensureAuth,
    async (req, res) => {
        try {
            let story = await Story.findById(req.params.id)
                .populate('user')
                .lean()

            if (!story) {
                res.status(404).render('error/404')
            }

            if (story.user._id != req.user.id && story.status== 'private') {
                res.render('error/404')
            } else {
                res.render('stories/show', { story })
            }
        } catch (error) {
            console.error(error)
            res.render('error/500')
        }
    }
)

/**
 * @desc Show edit story page
 * @route GET /stories/edit/:id
 */
 router.get(
    '/edit/:id', ensureAuth,
    async (req, res) => {
        try {
            const story = await Story.findOne({
                _id: req.params.id
            }).lean()
    
            if (!story) {
                res.render('error/404')
            }
    
            if (story.user == req.user.id) {
                res.render('stories/edit', { story })
            } else {
                res.redirect('/stories')
            }
        } catch (error) {
            console.error(error)
            return res.render('error/500')  
        }
    }
)

/**
 * @desc Update story
 * @route PUT /stories/:id
 */
 router.put(
    '/:id', ensureAuth,
    async (req, res) => {
        try {
            let story = await Story.findById(req.params.id).lean()
    
            if (!story) {
                return res.render('error/404')
            }
    
            if (story.user == req.user.id) {
                story = await Story.findOneAndUpdate(
                    {
                        _id: req.params.id
                    },
                        req.body,
                    {
                        new: true,
                        runValidators: true
                    })
    
                    res.redirect('/dashboard')
            } else {
                res.redirect('/stories')
            }
        } catch (error) {
            console.error(error)
            return res.render('error/500')    
        }
    }
)

/**
 * @desc Delete a Story
 * @route DELETE /stories/:id
 */
 router.delete(
    '/:id', ensureAuth,
    async (req, res) => {
        try {
            await Story.remove({_id: req.params.id})
            res.redirect('/dashboard')
        } catch (error) {
            console.error(error)
            return res.render('error/500')    
        }
    }
)

/**
 * @desc Show User Stories
 * @route GET /stories/user/:userId
 */
 router.get(
    '/user/:userId', ensureAuth,
    async (req, res) => {
        try {
            const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
            })
            .populate('user')
            .lean()
    
            res.render('stories/index', { stories })
        } catch (error) {
            console.error(error)
            res.render('error/500')
        }
    }
)

/**
 * @desc Search stories by title
 * @route GET /stories/search/:query
 */
 router.get(
    '/search/:query', ensureAuth,
    async (req, res) => {
        try {
            const stories = await Story.find({
                title: new RegExp(req.query.query, 'i'),
                status: 'public'
            }).populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

            stories ? res.render('stories/index', { stories })
                : res.status(404).render('error/404')
        } catch (error) {
            console.error(error)
            res.render('error/500')
        }
    }
)


module.exports = router