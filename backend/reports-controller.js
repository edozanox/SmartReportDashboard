const connection = require('../utils/db');

module.exports.postReport = async function (req, res) {
    const {categoria, indirizzo, descrizione, coordinate, email, telefono} = req.body
    connection.query(
        'INSERT INTO reports (`categoria`, `indirizzo`, `descrizione`, `coordinate`, `data_inserimento`, `email`, `telefono`) VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.categoria, req.body.indirizzo, req.body.descrizione, req.body.coordinate, req.body.email, req.body.telefono],
        function(err, results, fields) {
           
        }
    )
}

module.exports.allReports = async function (req, res) {
    connection.query(
        'SELECT id, categoria, coordinate, data_inserimento FROM reports',
        {},
        function(err, results, fields) {
            res.json(results);
        }
    )
}


