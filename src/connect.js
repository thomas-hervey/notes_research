const mongoose = require('mongoose');

// tell mongoose which promise
// implementation to use (es6)
mongoose.Promise = global.Promise;


function connect() {
	const mongo_address = `mongodb://localhost:27017/notes`;
	mongoose.connect(mongo_address);
	mongoose.Promise = global.Promise; // Get Mongoose to use the global promise library
	const db = mongoose.connection;
	db.on('connected', () => {
		console.log(`Mongoose default connection open to ${mongo_address}`);
	});
	db.on('error', console.error.bind(console, 'connection error:'));
	db.on('disconnected', () => {
		console.log(
			`Mongoose default connection disconnected from ${mongo_address}`
		);
	});
	return db
}

module.exports = connect;
