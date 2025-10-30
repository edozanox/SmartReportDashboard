const connection = require('./db');

module.exports.allGruppi = async function (req, res) {
   const [gruppi] = await (await connection).query('SELECT * FROM gruppi');
   return gruppi;
}


