/*=====Toker-Generator=====*/
exports.TokenGenerator = require('token-generator')({
    salt: 'your secret ingredient for this magic recipe', //semilla: sirve para luego saber si un token fue creado por esta app
    timestampMap: 'abcdefghij', // 10 chars array for obfuscation proposes 
});

/*===========Mongoose=========*/
var mongoose = require('mongoose');

mongoose.connect('mongodb://mdangelo:dangelo@ds047030.mongolab.com:47030/airbnb', function(err) {
    if (err) {
        console.log("+++Conection DB-ERROR+++++", err);
    } else {
        console.log("+++Conection DB-OK+++++");
    }
});

var schema = new mongoose.Schema({
    name: String,
    lastName: String,
    age: Number,
    email: String,
    password: String,
    token:String
});

//El modelo siempre en singular, moongose despues me lo pone en plurarl (collection)
exports.Employee = mongoose.model('Employee', schema);

/*****Testing-Purpose******/
var employeeTest = new exports.Employee({
    name: 'EmplTestName',
    lastName: 'EmplTestLName',
    age: 999,
    email: 'empl-test@mail.com',
    password: 'EmplPass',
    token: exports.TokenGenerator.generate()
});

function testing() {
    employeeTest.save(function(err) {
        if (err)
            console.log("todo MAL con user");
        else {
            console.log("todo BIEN con user ", employeeTest);
        }
    });
}
//testing();