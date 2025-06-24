const connection = require('./db');

module.exports.postReport = async function (req, res) {
    try {
        const uuid = crypto.randomUUID();    
        const {id, categoria, indirizzo, descrizione, coordinate, data_inserimento, data_aggiornamento, assegnatario, status, email, telefono, annotazioni} = req.body;
        const result = connection.query(
            'INSERT INTO reports (`id`, `categoria`, `indirizzo`, `descrizione`, `coordinate`, `data_inserimento`, `data_aggiornamento`, `assegnatario`, `status`, `email`, `telefono`, `annotazioni`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [uuid, categoria, indirizzo, descrizione, coordinate, data_inserimento, data_aggiornamento, assegnatario, status, email, telefono, annotazioni],
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


