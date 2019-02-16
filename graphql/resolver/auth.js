const bcrypt= require('bcryptjs');
const User = require('../../models/users');
module.exports={
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