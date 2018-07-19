const mongoose = require('mongoose');
const connect = require('../../mongodb/connection');
const checkIsNonEnglish = require('../utils/checkIsNonEnglish');

const lda = require('lda');

// open connection
const db = connect(address, port, database);

function getDocs() {
	const values = [];

	const cursor = Input.find({}).cursor();
	cursor.on('data', doc => {
		if (!checkIsNonEnglish(doc.dimension_keyword)) {
			values.push(doc.dimension_keyword);
		}
	});
	cursor.on('close', () => {
		// Called when done
		console.log('close');
		const valuesSubset = values.slice(0, 2000);
    console.log(lda(valuesSubset, 20, 3));
    done()
	});
}

getDocs();
