const {buildSchema}= require('graphql');

module.exports=buildSchema(`

  type Booking{
  _id:ID!
    event:Event!
    user:User!
    createdAt:String!
    updatedAt:String!
  }
  type Event{
  _id:ID!
  title:String!
  description:String!
  price:Float!
  date:String!
  creator:User!
  }
  
  type User{
    _id:ID!
    firstName:String!
    email:String!
    lastName:String
    createdEvents:[Event!]
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
        bookings:[Booking!]!
        users:[User!]!
    }
    
    type rootMutation{
        createEvent(eventInput:EventInput): Event
        createUser(userInput:UserInput): User
        bookEvent(eventId:ID!):Booking!
        cancelBooking(bookingId:ID!): Event!
    }
    schema {
      query:rootQuery
      mutation:rootMutation
    }
  `);