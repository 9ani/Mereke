const stars = document.querySelectorAll('.comment-stars>img')
function rateEvent(rate){
    for(let i=0; i< stars.length;i++){
        stars[i].classList.remove('active-star')
    }
    for(let i=0; i< rate;i++){
        stars[i].classList.add('active-star')
    }

}

function sendRate(e) {
    e.preventDefault();
    console.log("Form submitted");

    const activeStars = document.querySelectorAll('.active-star');
    const comment_text = document.querySelector('#comment-text').value;
    const author = document.querySelector('#comment-author').value;
    const event = document.querySelector('#comment-event').value;

    console.log("Active stars:", activeStars.length);
    console.log("Comment text:", comment_text);
    console.log("Author:", author);
    console.log("Event:", event);

    if (activeStars.length > 0) {
        axios.post('/api/rate', {
            rate: activeStars.length,
            text: comment_text,
            authorId: author,
            eventId: event
        }).then(data => {
            if (data.data) {
                location.reload();
            }
        }).catch(error => {
            console.error("Error:", error); 
        });
    }
}
