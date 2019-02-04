const  createError = require('http-errors');
const express = require('express');
const bodyParser= require('body-parser');
const graphqlhttp= require('express-graphql');
const {buildSchema}= require('graphql');
const mongoose = require('mongoose');
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
  
  input EventInput{
  title:String!
  description:String!
  price:Float!
  date:String!
  
  } 
    type rootQuery{
        events: [Event!]!,
        newEvents:String!
    }
    
    type rootMutation{
        createEvent(eventInput:EventInput): Event
    }
    schema {
      query:rootQuery
      mutation:rootMutation
    }
  `),
  rootValue:{
    events:()=> {
      return events;
    },
    createEvent:(args)=>{
      const event={
        _id:Math.random().toString(),
        title:args.eventInput.title,
        description:args.eventInput.description,
        price: +args.eventInput.price,
        date:new Date().toISOString()
      };
      events.push(event);
      return event;
    },
    newEvents:(args)=>{
      return 'You entered a name of new event';
    }
  },
  graphiql:true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-itdbo.mongodb.net/test?retryWrites=true`)
    .then(()=>console.log(`connection to database success`))
    .catch(((err)=>console.log(`error ${err}`)));
app.listen(port,()=>{
  console.log(`server started on port ${port}`);
});
