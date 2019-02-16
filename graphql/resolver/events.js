const Event = require('../../models/events');
const User = require('../../models/users');
const {transformEvent}= require('./merge');




module.exports={
    events: async ()=> {
        const result= await Event.find();
        try{
            return  result.map((event)=>{
                return transformEvent(event);
            });
        }catch (err) {
            throw err
        }
    },
    createEvent: async (args)=>{
        const event = new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator:'5c5b158a683813c8a96891dc'
        });
        const result= await event.save();
        try{
            const res=  await  User.findById('5c5b158a683813c8a96891dc');
            if(!res){
                throw new Error('User Does Not exist');
            }
            res.createdEvents.push(result);
            const updated=await res.save();
            try {
                return transformEvent(result);
            }
            catch(err){
                throw err;
            }
        }catch(err){
            throw  err;
        }
    },
};