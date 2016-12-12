//src/server.js

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
// import NotFoundPage from './components/NotFoundPage';

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
const mongoose = require('mongoose');
var list = require('./models/todolist');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cookieParser = require('cookie-parser');
var mongodb = require('mongodb');
var db;
var BSON=mongodb.BSONPure;
const dbaccess = require('./config/dbaccess');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'public')));


// Connect to the db
mongodb.MongoClient.connect('mongodb://'+dbaccess.username+':'+dbaccess.password+'@'+dbaccess.location+'.mlab.com:'+
  dbaccess.port+'/'+dbaccess.database, (err, database) => {
  if (err){
    return console.log(err);
  }
  db = database;
})


app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.use(cookieParser());
// universal routing and rendering
// app.get('*', (req, res) => {
//   match(
//     { routes, location: req.url },
//     (err, redirectLocation, renderProps) => {

//       // in case of error display the error message
//       if (err) {
//         return res.status(500).send(err.message);
//       }

//       // in case of redirect propagate the redirect to the browser
//       if (redirectLocation) {
//         return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
//       }

//       // generate the React markup for the current route
//       let markup;
//       if (renderProps) {
//         // if the current route matched we have renderProps
//         markup = renderToString(RouterContext(renderProps));
//       } else {
//         // otherwise we can render a 404 page
//         // markup = renderToString(<NotFoundPage/>);
//         res.status(404);
//       }

//       // render the index template with the embedded React markup
//       return res.render('index', { markup });
//     }
//   );
// });

/**
 * GET /api/list
 * get list from DB.
 */
app.get('/api/list', function(req, res, next) {
  db.collection('toDoLists').find().toArray(function(err, docs){
          console.log(docs);
          res.send(docs);
    });
});

app.post('/api/list', function(req, res) {
  var body = "";
  console.log("BUDY");
  console.log(req.body);
  console.log(req.body.text);
  db.collection('toDoLists').save(req.body, (err, result) => {
    if (err) {
      return console.log(err)
    }
    console.log('saved to database')
  });
  //       // get and return all the todos after you create another
  //   });
});
app.delete('/api/list/:id', function(req, res) {
  console.log(req.params._id)
  db.collection('toDoLists').deleteOne({'_id': new mongodb.ObjectID(req.params.id)}, (err, result) => {
    if (err) {
      return console.log(err)
    }
    res.send({message: "successfully deleted"});
  });
});
/**
 * POST /api/characters
 * Adds new character to the database.
 */
// app.post('/api/characters', function(req, res, next) {
//   var gender = req.body.gender;
//   var characterName = req.body.name;
//   var characterIdLookupUrl = 'https://api.eveonline.com/eve/CharacterID.xml.aspx?names=' + characterName;

//   // var parser = new xml2js.Parser();

//   async.waterfall([
//     function(callback) {
//       request.get(characterIdLookupUrl, function(err, request, xml) {
//         if (err) return next(err);
//         parser.parseString(xml, function(err, parsedXml) {
//           if (err) return next(err);
//           try {
//             var characterId = parsedXml.eveapi.result[0].rowset[0].row[0].$.characterID;

//             Character.findOne({ characterId: characterId }, function(err, character) {
//               if (err) return next(err);

//               if (character) {
//                 return res.status(409).send({ message: character.name + ' is already in the database.' });
//               }

//               callback(err, characterId);
//             });
//           } catch (e) {
//             return res.status(400).send({ message: 'XML Parse Error' });
//           }
//         });
//       });
//     },
//     function(characterId) {
//       var characterInfoUrl = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=' + characterId;

//       request.get({ url: characterInfoUrl }, function(err, request, xml) {
//         if (err) return next(err);
//         parser.parseString(xml, function(err, parsedXml) {
//           if (err) return res.send(err);
//           try {
//             var name = parsedXml.eveapi.result[0].characterName[0];
//             var race = parsedXml.eveapi.result[0].race[0];
//             var bloodline = parsedXml.eveapi.result[0].bloodline[0];

//             var character = new Character({
//               characterId: characterId,
//               name: name,
//               race: race,
//               bloodline: bloodline,
//               gender: gender,
//               random: [Math.random(), 0]
//             });

//             character.save(function(err) {
//               if (err) return next(err);
//               res.send({ message: characterName + ' has been added successfully!' });
//             });
//           } catch (e) {
//             res.status(404).send({ message: characterName + ' is not a registered citizen of New Eden.' });
//           }
//         });
//       });
//     }
//   ]);
// });

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});