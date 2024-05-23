document.addEventListener("DOMContentLoaded", function () {
  const bookingsData = JSON.parse(document.getElementById('bookingsData').value);
  initCalendar();
  addEventsToCalendar(bookingsData);
});


function initCalendar() {
  const Calendar = tui.Calendar;
  const container = document.getElementById('calendar');
  const options = {
    defaultView: 'month',
    useFormPopup: true,
    useDetailPopup: true,
    calendars: [
      {
        id: '1',
        name: 'Bookings',
        backgroundColor: '#03bd9e',
      }
    ]
  };

  window.calendar = new Calendar(container, options);
  console.log('Calendar initialized');
}

function addEventsToCalendar(bookings) {
  console.log('Adding events to calendar', bookings);
  const events = bookings.map(booking => {
    const event = {
      id: booking._id,
      calendarId: '1',
      title: `${booking.title} -  ${booking.location}`,
      category: 'time',
      start: `${booking.date.split('T')[0]}T${booking.time}`,
      end: `${booking.date.split('T')[0]}T${booking.time}`,
      location: booking.location,
    };
    console.log('Event to add:', event);
    return event;
  });

  window.calendar.createEvents(events);
  console.log('Events added to calendar');
}

function addEventToCalendar(booking) {
  const event = {
    id: booking.id,
    calendarId: booking.calendarId,
    title: booking.title,
    category: booking.category,
    start: booking.start,
    end: booking.end,
    location: booking.location,
  };

  if (window.calendar) {
    window.calendar.createSchedules([event]);
  } else {
    console.error("Calendar is not initialized.");
  }
}


function bookEvent(eventId) {
  axios.post("/api/book", { eventId })
    .then((response) => {
      alert("Booking successful");

      if (response.data && typeof response.data === "object") {
        addEventToCalendar(response.data);
      } else {
        console.error("Invalid booking data:", response.data);
      }

      location.reload(); // Reload the page to reflect changes
    })
    .catch((error) => {
      console.error("Error booking event:", error);
    });
}

function deleteBooking(bookingId) {
  axios.post("/api/delete-booking", { bookingId: bookingId })
    .then((data) => {
      if (data.data) {
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
