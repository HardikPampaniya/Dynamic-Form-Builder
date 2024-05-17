const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "dynamic-form-builder"
});

module.exports = db;
