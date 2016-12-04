const express = require('express')
const path = require('path')
const port = process.env.PORT || 4000
const app = express()//lets require/import the mongodb native drivers.
const mongoose = require('mongoose');

/*
 * I’m sharing my credential here.
 * Feel free to use it while you’re learning.
 * After that, create and use your own credential.
 * Thanks.
 *
 * MONGOLAB_URI=mongodb://example:example@ds053312.mongolab.com:53312/todolist
 * 'mongodb://example:example@ds053312.mongolab.com:53312/todolist'
 */
MONGOLAB_URI="mongodb://admin:Chuckster900@ds119738.mlab.com:19738/todolistv1db"

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

// serve static assets normally
app.use(express.static(__dirname + '/public'))

// Handles all routes so you do not get a not found error
app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.listen(port)
console.log("server started on port " + port)

