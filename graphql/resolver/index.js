const Auth = require('./auth');
const Event= require('./events');
const bookings= require('./bookings');

const rootResolver={
    ...Auth,
    ...Event,
    ...bookings
};
module.exports= rootResolver;