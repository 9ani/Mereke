const Event = require('./Event')
const fs = require('fs')
const path = require('path')
const User = require('../auth/User')



const createEvent = async (req, res) => {
    try {
        const { title, description, time, date, location, availableSeats, category } = req.body;
        console.log({ title, description, time, date, location, availableSeats, category });
        if (!title || title.length < 3 ||
            !description || description.length < 5 ||
            !date ||
            !location || location.length < 3 ||
            !availableSeats || availableSeats < 1) {
            return res.redirect('/new-event?error=1');
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
        res.redirect('/new-event?error=2');
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

        if (
            req.file &&
            title.length > 2 &&
            description.length > 2 &&
            new Date(date) > new Date() &&
            time.length > 2 &&
            location.length > 2 &&
            availableSeats > 0
        ) {
            const event = await Event.findById(id);
            if (!event) {
                return res.redirect(`/edit/${id}?error=2`);
            }

            if (event.image) {
                fs.unlinkSync(path.join(__dirname, '../../../public', event.image));
            }

            await Event.findByIdAndUpdate(
                id,
                {
                    title,
                    description,
                    date,
                    time,
                    location,
                    availableSeats,
                    category,
                    image: `/images/events/${req.file.filename}`,
                },
                { new: true }
            );

            res.redirect('/admin/' + req.user._id);
        } else {
            res.redirect(`/edit/${id}?error=1`);
        }
    } catch (error) {
        console.error(error);
        res.redirect(`/edit/${req.body.id}?error=3`);
    }
};


const bookEvent = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        const eventId = req.body.id;

        if (!userId || !eventId) {
            return res.status(400).send('Invalid request');
        }

        const user = await User.findById(userId);
        const event = await Event.findById(eventId);

        if (!user || !event) {
            return res.status(404).send('User or event not found');
        }

        if (event.availableSeats <= 0) {
            return res.status(400).send('No available seats');
        }

        // const isEventBooked = user.registeredEvents.includes(eventId);
        // if (isEventBooked) {
        //     return res.send('Вы уже зарегистрированы на это событие');
        // }

        event.availableSeats -= 1;
        event.attendees.push(userId);
        await event.save();

        user.bookings.push(eventId);
        await user.save();

        res.send('Мероприятие успешно забронировано');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
};
const cancelBooking = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        const eventId = req.body.id;

        if (!userId || !eventId) {
            return res.status(400).send('Invalid request');
        }

        const user = await User.findById(userId);
        const event = await Event.findById(eventId);

        if (!user || !event) {
            return res.status(404).send('User or event not found');
        }

        // const isEventBooked = user.registeredEvents.includes(eventId);
        // if (!isEventBooked) {
        //     return res.status(400).send('Вы не зарегистрированы на это событие');
        // }

        event.attendees = event.attendees.filter(attendee => !attendee.equals(userId));
        event.availableSeats += 1;
        await event.save();

        user.registeredEvents = user.registeredEvents.filter(event => !event.equals(eventId));
        await user.save();

        res.send('Бронирование успешно отменено');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
};



module.exports = {
    createEvent,
    bookEvent,
    cancelBooking,
    editEvent
}