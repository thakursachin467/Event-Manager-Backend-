const Event = require('../../models/events');
const {dateToString}= require('../../utils/date');
const User = require('../../models/users');

const transformEvent=(event)=>{
    return{
        ...event._doc,
        _id:event.id,
        date:dateToString(event._doc.date),
        creator:user(event.creator)
    }
};


const transformBooking= (booking)=>{
    return{
        ...booking,
        _id:booking.id,
        event:createdEvent.bind(this,booking._doc.event),
        user:user.bind(this,booking._doc.user),
        createdAt:dateToString(booking._doc.createdAt),
        updatedAt:dateToString(booking._doc.updatedAt)
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
        return transformEvent(event);
    }catch (e) {
        throw  e;
    }
};



const user= async (userId)=>{
    const user= await User.findById(userId);
    try{
        if(!user){
            throw new Error('This user is not valid');
        }
        return {
            ...user._doc,
            _id:user.id,
            createdEvents:createdEvents.bind(this,user._doc.createdEvents)
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