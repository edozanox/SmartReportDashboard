const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

//Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173/'], // porte comuni per Vue
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Allow-Origin'],
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404);
    res.send('Pagina non trovata, specificare endpoint');
});

//POST report
app.post("/api/reports/send", async (req, res) => {
    console.log("Creazione report...");
    try {
        controller.postReport(req);
        res.status(201).send("Report creato con successo!");
    } catch {
        res.status(500).send("Errore creazione report");
    }
});

//GET allReports
app.use("/api/reports/getAll", (req, res, next) => {

});

app.listen(port, function() {
    console.log("Server is running on port " + port);
});

