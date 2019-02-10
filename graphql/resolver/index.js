const bcrypt= require('bcryptjs');
const Event = require('../../models/events');
const User = require('../../models/users');
const Entity= require('../utils/entity');



const  createdEvents= async  (eventIds)=>{
    const events=  await Event.find({_id:{$in:eventIds}});
    try{
        events.map((event)=>{
            return {
                ...event._doc,
                _id:event.id,
                creator:user.bind(this,event._doc.creator)
            }
        });
        
    }catch (err) {
        throw err;
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

module.exports={
    events: async ()=> {
       const result= await Event.find();
       try{
         return  result.map((event)=>{
               return {
                   ...event._doc,
                   _id:event.id,
                   date:new Date(event._doc.date).toISOString(),
                   creator:user(event.creator)
               }
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
            try{
                return{
                    ...result._doc,
                    date:new Date(result._doc.date).toISOString(),
                    creator:user(result._doc.creator)
                }
            }catch(err){
                throw err;
            }
        }catch(err){
            throw  err;
        }
    },
    createUser: async (args)=>{
       const res= await User.findOne({email:args.userInput.email});
        try{
            if(res) {
                throw new Error('User Already Exists');
            }
            const   hashedPassword= await bcrypt.hash(args.userInput.password,12);
            const user= new User({
                email:args.userInput.email,
                password:hashedPassword,
                firstName:args.userInput.firstName,
                lastName:args.userInput.lastName
            });
            const result= await user.save();
            return {...result._doc,_id:result.id}
        }catch(err){
            throw  err;
        }

    }
};