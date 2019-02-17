const jwt= require('jsonwebtoken');
module.exports= (req,res,next)=>{
    const authHeader= req.get('Authorization');
    if(!authHeader){
        req.isAuth= false;
       return next();
    }
    const token= authHeader.split(' ')[1];
    if(!token || token===' '){
        req.isAuth= false;
        return next();
    }
    let verification;
    try{
         verification=  jwt.verify(token,'damnthiskey');
    }catch (e) {
        req.isAuth= false;
        return next();
    }
    if(!verification){
        req.isAuth= false;
        return next();
    }

    req.isAuth= true;
    req.user= verification.userId;
    return next();
};