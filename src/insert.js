const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inputJson = require('../raw_data/notes/opened.json'); // source data

const franc_min = require('franc-min');
const cld = require('cld');
const lda = require('lda');
// open connection
const connect = require('./connect');
connect();
const db = connect();

// create a model
const InputTextSchema = new Schema({
    note_id: Number,
    uid: Number,
    text: String
});
const Input = mongoose.model('input', InputTextSchema);


function insertInitial() {
    Input.insertMany(inputJson, function(err,result) {
        if (err) {
            // handle error
            console.log('error: ', err);
        } else {
            // handle success
            console.log('success!');
        }
        });
}

function saveOnlyEnglish() {
    const values = [];
    const cursor = Input.find({}).cursor();

    cursor.on('data', doc => {
        var inputText = doc.inputText;

        // if it is english, push it
        cld.detect(inputText, function(err, result) {
            if (err) {
                // console.log('ERROR: ', err, '   =====   ', inputText);
                return;
            }
            if (result === undefined) {
                // console.log('UNDEFINED: ', inputText);
                return;
            }

            // if the result has a language
            if (result && result.languages && result.languages.length > 0) {
                var language = result.languages[0].name;
                // console.log('language: ', language);
                // if the language is english ... push it
                if(language === 'ENGLISH') {
                    values.push({
                         'inputText': inputText
                    });
                }
            }
        })
    });
    cursor.on('close', () => {
        // Called when done
        console.log('close');
        console.log('value length: ', values.length);

        console.log(values.slice(0, 100));
        var obj = { table: values };

        var json = JSON.stringify(obj);
        fs.writeFile('english.json', json, 'utf8', function(response) {
            console.log('response while writing: ', response);
        });
    });
}


function splitAllWords() {

}

insertInitial();
// saveOnlyEnglish();