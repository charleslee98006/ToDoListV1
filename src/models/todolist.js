var mongoose = require('mongoose');
var toDoListSchema = new mongoose.Schema({
	text: String
});

module.exports = mongoose.model('todoLists', toDoListSchema);  