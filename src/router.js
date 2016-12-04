//import dependencies
const express = require('express');

// import controllers
const _ticketController = require('./controllers/_ticket-control');

module.exports = function(app) {

  const apiRoutes = express.Router(), 
  ticketRoutes = express.Router();

  apiRoutes.use('/tickets', ticketRoutes);

  ticketRoutes.post('/create-new-ticket', _ticketController.createTicket);

  app.use('/api', apiRoutes);
}