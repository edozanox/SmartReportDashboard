const connection = require('./db');

module.exports.postReport = async function (req, res) {
    try {
        const uuid = crypto.randomUUID();    
        const {id, categoria, indirizzo, descrizione, coordinate, data_inserimento, data_aggiornamento, assegnatario, status, email, telefono, annotazioni} = req.body;
        const result = await (await connection).query(
            'INSERT INTO reports (`id`, `categoria`, `indirizzo`, `descrizione`, `coordinate`, `data_inserimento`, `data_aggiornamento`, `assegnatario`, `status`, `email`, `telefono`, `annotazioni`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [uuid, categoria, indirizzo, descrizione, JSON.stringify(coordinate), data_inserimento, data_aggiornamento, assegnatario, status, email, telefono, annotazioni],
        );        
        return {success: true}       
    }
    catch  (error) {
        return {success: false}
    }
}

module.exports.putReport = async function (req, res) {
    try {          
        const {assegnatario, status, annotazioni} = req.body;
        const values = [assegnatario, status, annotazioni];
        const query = 'UPDATE reports SET assegnatario = ?, status = ?, annotazioni = ? WHERE id = ?';
        (await connection).query(query, [...values, req.body.id], (err, results) => {
            if (error) {
                console.error('Errore durante l\'aggiornamento del report: ', error);
                return {success: false}
            }
            
        console.log('Report aggiornato con successo!', results);              
        return {success: true}       
        });
    }
    catch  (error) {
        return {success: false}
    }
}

module.exports.reportsByGroup = async function (req, res) {
   const [reports] = await (await connection).query('SELECT * FROM reports WHERE id_gruppo = ?', [req.params.group]);   
   return reports;
}

module.exports.reportsByStatus = async function (req, res) {
   const [reports] = await (await connection).query('SELECT * FROM reports WHERE status = ?', [req.params.status]);   
   return reports;
}

module.exports.allReports = async function (req, res) {
   const [reports] = await (await connection).query('SELECT * FROM reports');   
   return reports;
}


