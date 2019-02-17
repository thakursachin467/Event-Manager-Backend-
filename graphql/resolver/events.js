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
    createEvent: async (args,req)=>{
        if(!req.isAuth){
            throw  new Error(`Sorry You can't access this resource, Please Login` );
        }
        const user=req.userId;
        const event = new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator:user
        });
        const result= await event.save();
        try{
            const res=  await  User.findById(user);
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