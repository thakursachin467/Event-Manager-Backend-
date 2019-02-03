const  createError = require('http-errors');
const express = require('express');
const bodyParser= require('body-parser');
const graphqlhttp= require('express-graphql');
const {buildSchema}= require('graphql');

const app = express();
const port=5001;
// view engine setup


app.use('/graphql',graphqlhttp({
  schema:buildSchema(`
    type rootQuery{
        events: [String!]!,
        newEvents:String!
    }
    
    type rootMutation{
        createEvent(name:String): String
    }
    schema {
      query:rootQuery
      mutation:rootMutation
    }
  `),
  rootValue:{
    events:()=> {
      return ['sachin', 'thakur'];
    },
    createEvent:(args)=>{
      const Eventname=args.name;
      return Eventname;
    },
    newEvents:(args)=>{
      return 'You entered a name of new event';
    }
  },
  graphiql:true
}));

app.listen(port,()=>{
  console.log(`server started on port ${port}`);
});
