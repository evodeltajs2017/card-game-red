const sql = require("mssql");

class CreateArenaDeckRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}

	initialize() {
		this.generateThreeRandomCards();
		
	}

	generateThreeRandomCards(req, res){
		console.log(req);
        this.app.get("/arena-deck/", (req, res) => {
			new sql.Request().query(`SELECT TOP 3 * FROM [dbo].[CardType] ORDER BY NEWID()`, (err, result) => {
				if (err) {
					console.log(err);
					return;
				}
				res.json(result.recordset);
			});	
		});
    }
}

module.exports = CreateArenaDeckRoute;