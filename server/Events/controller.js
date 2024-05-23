const Event = require("./Event");
const fs = require("fs");
const path = require("path");
const User = require("../auth/User");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      time,
      date,
      location,
      availableSeats,
      category,
    } = req.body;
    console.log({
      title,
      description,
      time,
      date,
      location,
      availableSeats,
      category,
    });
    if (
      !title ||
      title.length < 3 ||
      !description ||
      description.length < 5 ||
      !date ||
      !location ||
      location.length < 3 ||
      !availableSeats ||
      availableSeats < 1
    ) {
      return res.redirect("/new-event?error=1");
    }

    const eventData = {
      title,
      description,
      time,
      date,
      location,
      availableSeats,
      category,
      image: req.file ? `/images/events/${req.file.filename}` : undefined,
    };

    await new Event(eventData).save();

    res.redirect(`/admin/${req.user._id}`);
  } catch (error) {
    console.error(error);
    res.redirect("/new-event?error=2");
  }
};

const editEvent = async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      date,
      time,
      location,
      availableSeats,
      category,
    } = req.body;

    console.log("Request Body:", req.body);

    if (!title || title.length <= 2) {
      console.error("Validation failed: Invalid title");
      return res.redirect(`/edit/${id}?error=1`);
    }
    if (!description || description.length <= 2) {
      console.error("Validation failed: Invalid description");
      return res.redirect(`/edit/${id}?error=1`);
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.error("Validation failed: Invalid date format");
      return res.redirect(`/edit/${id}?error=1`);
    }
    if (!time || time.length <= 2) {
      console.error("Validation failed: Invalid time");
      return res.redirect(`/edit/${id}?error=1`);
    }
    if (!location || location.length <= 2) {
      console.error("Validation failed: Invalid location");
      return res.redirect(`/edit/${id}?error=1`);
    }
    if (!availableSeats || availableSeats <= 0) {
      console.error("Validation failed: Invalid availableSeats");
      return res.redirect(`/edit/${id}?error=1`);
    }

    const event = await Event.findById(id);
    if (!event) {
      console.error("Event not found:", id);
      return res.redirect(`/edit/${id}?error=2`);
    }

    const updatedData = {
      title,
      description,
      date,
      time,
      location,
      availableSeats,
      category,
    };

    if (req.file) {
      if (event.image) {
        try {
          fs.unlinkSync(path.join(__dirname, "../../../public", event.image));
        } catch (unlinkError) {
          console.error("Failed to delete old image:", unlinkError);
        }
      }
      updatedData.image = `/images/events/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    console.log("Updated Event:", updatedEvent);

    res.redirect("/admin/" + req.user._id);
  } catch (error) {
    console.error("Error updating event:", error);
    res.redirect(`/edit/${req.body.id}?error=3`);
  }
};

// const bookEvent = async (req, res) => {
//   try {
//     const eventId = req.body.eventId;
//     const event = await Event.findById(eventId);
//     if (!event) {
//         return res.status(404).send('Event not found');
//     }
//     if (event.availableSeats <= 0) {
//         return res.status(400).send('No available seats');
//     }
//     event.attendees.push(req.user._id);
//     event.availableSeats--;
//     await event.save();
//     req.user.bookings.push(eventId);
//     await req.user.save();
//     res.status(200).send('Event booked successfully');
// } catch (error) {
//     console.error('Error booking event:', error);
//     res.status(500).send('Internal server error');
// }
// };
const bookEvent = async (req, res) => {
  try {
    const eventId = req.body.eventId;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    if (event.availableSeats <= 0) {
      return res.status(400).send("No available seats");
    }
    event.attendees.push(req.user._id);
    event.availableSeats--;
    await event.save();
    req.user.bookings.push(eventId);
    await req.user.save();

    res.status(200).send({
      _id: event._id,
      title: event.title,
      description: event.description,
      time: event.time,
      date: event.date,
      location: event.location,
      availableSeats: event.availableSeats,
      category: event.category,
      image: event.image,
      attendees: event.attendees,
      __v: event.__v,
    });
  } catch (error) {
    console.error("Error booking event:", error);
    res.status(500).send("Internal server error");
  }
};

const cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.body.bookingId;

    // Find the user and event by their IDs
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    // Check if the user has booked the event
    if (!user.bookings.includes(eventId)) {
      return res.status(400).send(false); // User hasn't booked this event
    }

    // Remove user's booking from user's bookings array
    user.bookings.pull(eventId);

    // Remove user's ID from event's attendees array
    event.attendees.pull(userId);

    // Update available seats count
    event.availableSeats++;

    // Save changes to the database
    await user.save();
    await event.save();

    // Send success response
    res.status(200).send(true);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).send(false); // Internal server error
  }
};


const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).send("Not found");
    }

    const filePath = path.join(
      __dirname,
      "../../../mereke/public",
      event.image
    );
    console.log("Deleting file at path:", filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).send("ok");
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  createEvent,
  bookEvent,
  cancelBooking,
  editEvent,
  deleteEvent,
};
