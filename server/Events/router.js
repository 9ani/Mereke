const express = require("express");
const router = express.Router();
const { upload } = require("./multer");
const {
  createEvent,
  editEvent,
  bookEvent,
  cancelBooking,
  deleteEvent,
} = require("./controller");
const { isAuth, isAdmin } = require("../auth/middlewares");

router.post("/api/events/new", isAdmin, upload.single("image"), createEvent);
router.post("/api/events/edit", isAdmin, upload.single("image"), editEvent);
router.delete("/api/events/:id", isAdmin, deleteEvent);
router.post("/api/book", isAuth, bookEvent);
router.post('/api/delete-booking', isAuth, cancelBooking);

// router.delete('/api/events/save/:id',isAuth, )

module.exports = router;
