const  createError = require('http-errors');
const express = require('express');
const bodyParser= require('body-parser');
const graphqlhttp= require('express-graphql');
const {buildSchema}= require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/events');
const User = require('./models/users');
const bcrypt= require('bcryptjs');
const app = express();
const port=5001;
// view engine setup
const events=[];

app.use('/graphql',graphqlhttp({
  schema:buildSchema(`
  type Event{
  _id:ID!
  title:String!
  description:String!
  price:Float!
  date:String!
  }
  
  type User{
    _id:ID!
    firstName:String!
    email:String!
    lastName:String
  }
  
  input UserInput{
    email:String!
    password:String!
    firstName:String!
    lastName:String!
  }
  
  input EventInput{
  title:String!
  description:String!
  price:Float!
  date:String!
  
  } 
    type rootQuery{
        events: [Event!]!
        newEvents:String!
        users:[User!]!
    }
    
    type rootMutation{
        createEvent(eventInput:EventInput): Event
        createUser(userInput:UserInput): User
    }
    schema {
      query:rootQuery
      mutation:rootMutation
    }
  `),
  rootValue:{
    events:()=> {
      return Event.find().then(result=> {
        return result.map((event)=>{
          return {...event._doc,_id:event.id}
        })
      }).catch(err=>{
        throw err
      });
    },
    createEvent:(args)=>{
      const event = new Event({
        title:args.eventInput.title,
        description:args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator:'5c5b158a683813c8a96891dc'
      });
     return event
          .save()
          .then(result=>{
          return  User.findById('5c5b158a683813c8a96891dc')
              .then((res)=>{
                  if(!res){
                    throw new Error('User Does Not exist');
                  }
                  res.createdEvents.push(result);
                  return res.save()
                      .then((updated)=>{
                        return {...result._doc};
                      })
                      .catch((err)=>{
                        throw err;
                      });
              })
              .catch(err=>{
                throw  err;
              });
          })
          .catch(err=>{
            throw err;
          });
    },
    createUser:(args)=>{
     return User.findOne({email:args.userInput.email})
          .then((res)=>{
            if(res) {
              throw new Error('User Already Exists');
            }
            return  bcrypt.hash(args.userInput.password,12)
                .then((hashedPassword)=>{
                  const user= new User({
                    email:args.userInput.email,
                    password:hashedPassword,
                    firstName:args.userInput.firstName,
                    lastName:args.userInput.lastName
                  });
                  return  user.save()
                      .then((result)=>{
                        return {...result._doc,_id:result.id}
                      })
                      .catch((err)=>{throw err} );
                })
                .catch((err)=> {throw err});
          })
          .catch((err)=>{
            throw err;
          });
    }
  },
  graphiql:true
}));


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-itdbo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(()=>console.log(`connection to database success`))
    .catch(((err)=>console.log(`connection failed to database ${err}`)));
app.listen(port,()=>{
  console.log(`server started on port ${port}`);
});
