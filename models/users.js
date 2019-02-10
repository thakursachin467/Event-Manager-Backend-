const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const userSchema= new Schema({
    email:{
        require:true,
        type:String
    },
    password:{
        require: true,
        type:String
    },
    firstName:{
        require:true,
        type:String
    },
    lastName:{
        type:String
    },
    createdEvents:[
        {
            type:Schema.Types.ObjectId,
            ref:'Event'
        }
    ]
});

module.exports= mongoose.model('User',userSchema);