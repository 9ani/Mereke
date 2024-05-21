const express = require('express')
const router = express.Router()
const {upload} = require('./multer')
const {createEvent, editEvent, bookEvent, cancelBooking} = require('./controller')
const{isAuth,isAdmin} = require('../auth/middlewares')

router.post('/api/events/new',isAdmin, upload.single('image'), createEvent)
router.post('/api/events/edit',isAdmin, upload.single('image'), editEvent)
// router.delete('/api/events/:id',isAdmin, deleteFilm)
router.post('/api/events/book',isAuth, bookEvent)
router.post('/api/events/unbook',isAuth, cancelBooking)

// router.delete('/api/events/save/:id',isAuth, )

module.exports = router