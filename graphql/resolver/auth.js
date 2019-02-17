const bcrypt= require('bcryptjs');
const User = require('../../models/users');
const jwt= require('jsonwebtoken');
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

    },
    login:async ({email,password})=>{
            const user= await User.findOne({email});
            if(!user){
                throw new Error('Credentials do not match');

            }
          const isPresent= await bcrypt.compare(password,user.password);
            if(!isPresent){
                throw new Error('Credentials do not match');
            }
      const token=await jwt.sign({userId:user.id,email:user.email},'damnthiskey',{expiresIn: '1hr'});
            return{
                userId:user.id,
                token:token,
                tokenExpiration:1,
                firstName: user.firstName,
                lastName: user.lastName? user.lastName:''
            }
    }
};