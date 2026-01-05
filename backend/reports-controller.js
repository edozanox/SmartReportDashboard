const connection = require('./db');

module.exports.postReport = async function (req, res) {
    try {
        console.log('Ricevuto corpo della richiesta:', req.body);
        const uuid = crypto.randomUUID();    
        const {utenteId, categoria, indirizzo, descrizione, coordinate, data_inserimento, email, telefono, stato} = req.body;
        const result = await (await connection).query(
            'INSERT INTO reports (`id`, `id_utente`, `categoria`, `indirizzo`, `descrizione`, `coordinate`, `data_inserimento`, `email`, `telefono`, `stato`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [uuid, utenteId, categoria, indirizzo, descrizione, JSON.stringify(coordinate), data_inserimento, email, telefono, stato],
        );   
        return {success: true};      
    }
    catch  (error) {
        console.error('Errore durante l\'inserimento del report:', error);
        return res.status(500).json({success: false, error: error.message})
    }
}

module.exports.putReport = async function (req, res) {
    try {          
        const {id_gruppo, stato, annotazioni} = req.body;
        const values = [id_gruppo, stato, annotazioni];
        const query = 'UPDATE reports SET id_gruppo = ?, stato = ?, annotazioni = ? WHERE id = ?';
        const result = await (await connection).query(query, [...values, req.body.id]);
        console.log('Report aggiornato con successo!', result);              
        return res.json({success: true})       
    }
    catch  (error) {
        console.error('Errore durante l\'aggiornamento del report:', error);
        return res.status(500).json({success: false, error: error.message})
    }
}

module.exports.reportsByUser = async function (req, res) {  
   const [reports] = await (await connection).query('SELECT * FROM reports WHERE id_utente = ?', [req.params.userId]);   
   return reports;
}

module.exports.getReportsByFilters = async function (req, res) {
    try {
        const { id_utente, stato, id_gruppo, categoria, page = 1 } = req.body;
        const pageSize = 3;
        const offset = (page - 1) * pageSize;
        
        const whereClauses = [];
        const values = [];

        // Aggiungi filtri solo se presenti
        if (id_utente) {
            whereClauses.push('id_utente = ?');
            values.push(id_utente);
        }
        if (stato) {
            whereClauses.push('stato = ?');
            values.push(stato);
        }
        if (id_gruppo) {
            whereClauses.push('id_gruppo = ?');
            values.push(id_gruppo);
        }
        if (categoria) {
            whereClauses.push('categoria = ?');
            values.push(categoria);
        }

        // Costruisci la query per contare il totale
        let countQuery = 'SELECT COUNT(*) as total FROM reports';
        if (whereClauses.length > 0) {
            countQuery += ' WHERE ' + whereClauses.join(' AND ');
        }
        
        const [countResult] = await (await connection).query(countQuery, values);
        const totalItem = countResult[0].total;
        const totalPages = Math.ceil(totalItem / pageSize);

        // Costruisci la query per i dati
        let query = 'SELECT * FROM reports';
        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }
        query += ' ORDER BY data_inserimento DESC LIMIT ? OFFSET ?';
        values.push(pageSize, offset);

        const [reports] = await (await connection).query(query, values);
        
        return {
            success: true,
            data: reports,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalItem: totalItem,
                totalPages: totalPages
            }
        };
    } catch (error) {
        console.error('Errore nel filtraggio dei report:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports.allReports = async function (req, res) {
   const page = req.query.page ? parseInt(req.query.page) : 1;
   const pageSize = 3;
   const offset = (page - 1) * pageSize;
   
   // Conta il totale
   const [countResult] = await (await connection).query('SELECT COUNT(*) as total FROM reports');
   const totalItem = countResult[0].total;
   const totalPages = Math.ceil(totalItem / pageSize);
   
   // Recupera i dati paginati
   const [reports] = await (await connection).query('SELECT * FROM reports ORDER BY data_inserimento DESC LIMIT ? OFFSET ?', [pageSize, offset]);   
   
   return {
       data: reports,
       pagination: {
           currentPage: page,
           pageSize: pageSize,
           totalItem: totalItem,
           totalPages: totalPages
       }
   };
}


