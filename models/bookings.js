const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const bookingSchema= new Schema({
    event:{
        type:Schema.Types.ObjectId,
        ref:'Event'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    cancel:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports= mongoose.model('Booking',bookingSchema);