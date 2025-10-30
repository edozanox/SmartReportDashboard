const express = require('express');
const cors = require('cors');
const reportController = require('./reports-controller');
const groupsController = require('./gruppi-controller');
const app = express();
const port = 3000;

//Middleware
// app.use(cors({
//   origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173/'], // porte comuni per Vue
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Allow-Origin'],
//   credentials: false
// }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, max-age=0',
    'Pragma': 'no-cache' // Per evitare l'uso della cache e 304 Not Modified alle chiamate
  });
  next();
});

app.set('etag', false);

//POST report
app.post("/api/reports/send", async (req, res) => {
    console.log("Creazione report...");
    try {
        await reportController.postReport(req);
        console.log("Report creato con successo!");
        res.status(201).send("Report creato con successo!");
    } catch {
        res.status(500).send("Errore creazione report");
    }
});

//PUT report
app.put("/api/reports/change", async (req, res) => {
    console.log("Creazione report...");
    try {
        await reportController.postReport(req);
        
        res.status(201).send("Report modificato con successo!");
    } catch {
        res.status(500).send("Errore creazione report");
    }
});


//GET allReports
app.get("/api/reports/getAll", async (req, res) => {
    console.log("Recupero di tutti i reports...");
    try {
        var reports = await reportController.allReports(req);        
        res.json({success: true, data: reports});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
});

//GET allGruppi
app.get("/api/gruppi/getAll", async (req, res) => {
    console.log("Recupero di tutti i gruppi...");
    try {
        //Recupero gruppi
        var groups = await groupsController.allGruppi(req);      

        //Calcolo numero report per gruppo
        for (let i = 0; i < groups.length; i++) {
            const gruppo = groups[i];
            const [reports] = await (await require('./db')).query('SELECT COUNT(*) AS count FROM reports WHERE id_gruppo = ?', [gruppo.id]);
            gruppo.segnalazioniAssociate = reports[0].count;
        }
        res.json({success: true, data: groups});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
});

app.get('/', (req, res) => {
  res.send('Server is running, yuppie!!!');
});

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404);
    res.send('Pagina non trovata, specificare endpoint');
});

app.listen(port, function() {
    console.log("Server is running on port " + port);
});

