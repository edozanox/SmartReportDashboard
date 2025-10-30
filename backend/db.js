const mysql2 = require('mysql2/promise');
const connection = mysql2.createConnection({
    host: 'smart-reports.mysql.database.azure.com',
    port: 3306,
    user: 'edozano',
    password: 'Ci@o@54!',
    database: 'smart-reports',
    namedPlaceholders: true,
    requireSSL: false
});

module.exports = connection;