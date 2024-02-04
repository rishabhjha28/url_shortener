const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {})
.then((dbDetails) => {
    console.log('Connected to database',dbDetails.connections[0].name);
})
.catch((err) => {
    console.log('Error connecting to database',err);
})

