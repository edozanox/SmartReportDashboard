const express = require('express');
const cors = require('cors');
const controller = require('./reports-controller');
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

//POST report
app.post("/api/reports/send", async (req, res) => {
    console.log("Creazione report...");
    try {
        await controller.postReport(req);
        console.log("Report creato con successo!");
        res.status(201).send("Report creato con successo!");
    } catch {
        res.status(500).send("Errore creazione report");
    }
});

//GET allReports
app.get("/api/reports/getAll", async (req, res) => {
    console.log("Recupero di tutti i reports...");
    try {
        var reports = await controller.allReports(req);        
        res.json({success: true, data: reports});
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

