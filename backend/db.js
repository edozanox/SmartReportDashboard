const mysql2 = require('mysql2');
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_reports',
    namedPlaceholders: true,
});

module.exports = connection;