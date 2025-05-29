const express = require('express');
const app = express();
const port = 3000;

app.use(articoliRouter);

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404);
    res.send('Pagina non trovata');
});

//POST report
app.use("sendReport", (req, res, next) => {

});

//GET allReports
app.use("allReports", (req, res, next) => {

});

app.listen(port, function() {
    console.log("Server is running on port " + port);
});

