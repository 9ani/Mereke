function bookEvent(eventId) {
    axios.post('/api/book', { eventId })
        .then(response => {
            // Handle success (e.g., display a success message)
            console.log('Event booked successfully');
            location.reload(); // Reload the page to reflect changes
        })
        .catch(error => {
            // Handle error (e.g., display an error message)
            console.error('Error booking event:', error);
        });
}
