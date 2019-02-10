const  createError = require('http-errors');
const express = require('express');
const bodyParser= require('body-parser');
const graphqlhttp= require('express-graphql');
const mongoose = require('mongoose');
const Event = require('./models/events');
const User = require('./models/users');
const bcrypt= require('bcryptjs');
const schema= require('./graphql/schema/index');
const resolvers= require('./graphql/resolver/index');
const app = express();
const port=5001;
// view engine setup
const events=[];



app.use('/graphql',graphqlhttp({
  schema:schema,
  rootValue:resolvers,
  graphiql:true
}));


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-itdbo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(()=>console.log(`connection to database success`))
    .catch(((err)=>console.log(`connection failed to database ${err}`)));
app.listen(port,()=>{
  console.log(`server started on port ${port}`);
});
