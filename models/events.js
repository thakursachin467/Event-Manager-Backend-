const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const newEvent= new Schema({
    title:{
        require:true,
        type:String
    },
    description:{
        require: true,
        type:String
    },
    price:{
        require:true,
        type:Number
    },
    date:{
        require:true,
        default: Date.now(),
        type:Date
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports=mongoose.model('Event',newEvent);
