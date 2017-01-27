/**
 * database for connection with database
 */
"use strict"
// Retrive connection
const mysql = require('mysql');
//create connection object
//heroku my-sql cleardb credential set
const connection = mysql.createConnection({
  //put your database credential
  host     : '************',
  user     : '*********',
  password : '**********',
  database : '************'
});
// Connect to the db
connection.connect(function(err) {
    if (err) throw err;
});

//Function exports
module.exports = connection;
