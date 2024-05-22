const Rate = require('./Rates')
const saveRate = async(req, res)=>{
    
    if(req.body.authorId && req.body.eventId){
        await new Rate({
            rate: req.body.rate,
            text: req.body.text,
            eventId: req.body.eventId,
            authorId: req.body.authorId,
        }).save()
        res.status(200).send(true)

    }
}

module.exports ={
    saveRate,
}