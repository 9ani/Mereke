function deleteEvent(id){
    axios.delete(`/api/events/${id}`).then( data =>{
    if(data.status == 200){
        location.reload();
    }else if(data.status == 404){
        location.replace('/not-found')
    }
})
}