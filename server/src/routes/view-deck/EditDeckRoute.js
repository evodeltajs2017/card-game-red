const sql = require("mssql");

class EditDeckRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}
	
	initialize() {
		this.editDeckFromDatabase();
	}
	
	editDeckFromDatabase() {
		this.app.post("/deck/", (req, res) => {
			let deckId = req.body.id;
			let deckName = req.body.name;
			new sql.Request().query(`update [dbo].[Deck] set [Name] = '${deckName}' where Id = ${deckId}`, (err, result) => {
				res.json({
					isDeck: result.rowsAffected[0]
				});
			});
		});
	}
}

module.exports = EditDeckRoute;
