const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./lib/auth.js');
const dotenv = require('dotenv');
const { toNodeHandler, fromNodeHeaders } = require('better-auth/node');
const reportController = require('./reports-controller');
const groupsController = require('./gruppi-controller');
const app = express();
const port = 3000;

dotenv.config();

// Configurazione CORS
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'], // porte comuni per Vue
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Allow-Origin'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true,
}));

app.all('/api/auth/{*any}', toNodeHandler(auth.auth));
app.use(cookieParser());
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


//GET reportsFilteredByUser
app.get("/api/reports/getByUser", verifyAuth, requireRole('USER'), async (req, res) => {
    try {
        var reports = await reportController.reportsByUserId(req);        
        res.json({success: true, data: reports});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
});

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
app.put("/api/reports/change", verifyAuth, requireRole('ADMIN'), async (req, res) => {
    console.log("Modifica report...");
    try {
        await reportController.putReport(req);
        
        res.status(200).send();
    } catch {
        res.status(500).send();
    }
});

//GET risolviReport
app.patch("/api/reports/resolve/:id", verifyAuth, requireRole('ADMIN'), async (req, res) => {
    try {
        await reportController.resolveReport(req);
        
        res.status(200).send("Report segnalato come risolto");
    } catch {
        res.status(500).send("Errore risoluzione report");
    }
});

//GET allReports
app.get("/api/reports/getAll", verifyAuth, requireRole('ADMIN'), async (req, res) => {
    try {
        var result = await reportController.allReports(req);        
        res.json({success: true, data: result.data, pagination: result.pagination});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
});

//GET reportById
app.get("/api/reports/:id", verifyAuth, requireRole('ADMIN'), async (req, res) => {
    try {
        var report = await reportController.getReportById(req);        
        res.json({success: true, data: report});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
});

//GET reportsFiltered
app.post("/api/reports/getByFilters", verifyAuth, requireRole('ADMIN'), async (req, res) => {    
    try {
        var result = await reportController.getReportsByFilters(req);     
        res.json({success: true, data: result.data, pagination: result.pagination});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
});

//GET allGruppi
app.get("/api/gruppi/getAll", async (req, res) => {    
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

//DELETE deleteReportById
app.delete("/api/reports/:id", verifyAuth, requireRole('ADMIN'), async (req, res) => {
    try {
        var report = await reportController.deleteReportById(req);        
        res.json({success: true});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
});

app.get('/', (req, res) => {
  res.send('SmartReportDashboard API is running');
});

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404);
    res.send('Endpoint inesistente, ricontrolla l\'URL');
});

// Middleware per verificare l'autenticazione e il ruolo
async function verifyAuth(req, res, next) {
  try {
   
    // Prendi la sessione passando il contesto con headers e cookies
    const session = await auth.auth.api.getSession({ 
        headers: fromNodeHeaders(req.headers), 
        cookies: req.cookies,
    });
   
    if (!session?.user) {
      return res.status(401).json({ error: "Non autenticato" });
    }
    
    // Salva l'utente e il ruolo nella request
    req.user = session.user;
    req.userId = session.user.id;
    req.userRole = session.user.role;    
    
    next();
  } catch (error) {
    console.error("Errore verifyAuth:", error);
    res.status(401).json({ error: "Sessione non valida", details: error.message });
  }
}

// Middleware per verificare ruoli specifici
function requireRole(requiredRole) {
  return (req, res, next) => {
    if (req.userRole !== requiredRole) {
      return res.status(403).json({ error: "Operazione non consentita con il ruolo corrente" });
    }
    next();
  };
}

app.listen(port, function() {
    console.log("Server is running on port " + port);
});
