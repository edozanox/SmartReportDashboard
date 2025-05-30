const connection = require('./db');

module.exports.postReport = async function (req, res) {
    try {
        console.log(req);
        const {categoria, indirizzo, descrizione, coordinate, email, telefono} = req.body;
        const result = connection.query(
            'INSERT INTO reports (`categoria`, `indirizzo`, `descrizione`, `coordinate`, `data_inserimento`, `email`, `telefono`) VALUES (?, ?, ?, ?, ?, ?)',
            [categoria, indirizzo, descrizione, coordinate, email, telefono],
        );
        return {success: true}       
    }
    catch  (error) {
        return {success: false}
    }
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


