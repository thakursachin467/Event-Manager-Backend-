const Event = require('../../models/events');
const {dateToString}= require('../../utils/date');
const User = require('../../models/users');
const DataLoader = require('dataloader');

const eventLoader=new  DataLoader((eventIds)=>{
    return createdEvents(eventIds);
});

const userLoader= new DataLoader((userId)=>{
    return Users(userId);
});


const Users=(userIds)=>{
    return User.find({_id:{$in:userIds}});
};
const transformEvent=(event)=>{
    return{
        ...event._doc,
        _id:event.id,
        date:dateToString(event.date),
        creator:user(event.creator)
    }
};


const transformBooking= (booking)=>{
    return{
        ...booking,
        _id:booking.id,
        event:createdEvent.bind(this,booking.event),
        user:user.bind(this,booking.user),
        createdAt:dateToString(booking.createdAt),
        updatedAt:dateToString(booking.updatedAt),
        cancel:booking.cancel || false
    }
};

const  createdEvents= async  (eventIds)=>{
    const events=  await Event.find({_id:{$in:eventIds}});
    try{
        events.map((event)=>{
            return transformEvent(event);
        });

    }catch (err) {
        throw err;
    }
};

const createdEvent= async (eventId)=>{
    try{
        const event = await Event.findById(eventId);
        return  transformEvent(event);
    }catch (e) {
        throw  e;
    }
};



const user= async (userId)=>{
    const user= await userLoader.load(userId.toString());
    try{
        if(!user){
            throw new Error('This user is not valid');
        }
        return {
            ...user._doc,
            _id:user.id,
            createdEvents:()=> eventLoader.loadMany(user._doc.createdEvents)
        }
    }catch (err) {
        throw err;
    }
};

exports.user= user;
exports.createdEvent=createdEvent;
exports.createdEvents=createdEvents;
exports.transformEvent=transformEvent;
exports.transformBooking=transformBooking;