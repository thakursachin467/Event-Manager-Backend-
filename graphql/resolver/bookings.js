const {transformBooking,transformEvent}= require('./merge');
const Booking= require('../../models/bookings');
const Event = require('../../models/events');



module.exports={
    bookings: async  (args)=>{
        try{
            const bookings= await Booking.find();
            return bookings.map((booking)=>{
                return transformBooking(booking);
            });
        }catch (e) {
            throw e;
        }
    },
    bookEvent:async  (args)=>{
        const event =await Event.findOne({_id:args.eventId});
        const booking= new Booking({
            user:'5c5b158a683813c8a96891dc',
            event:event
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args)=>{
        try{
            const booking= await Booking.findOneAndUpdate({_id:args.bookingId},{cancel:true}).populate('event');
            const event= transformEvent(booking.event);
            return event;
        }catch (e) {
            throw e;
        }
    }
};