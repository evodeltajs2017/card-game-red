const sql = require("mssql");

class DeleteDeckRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}
	
	initialize() {
		this.deleteDeckFromDatabase();
	}
	
	deleteDeckFromDatabase() {
		this.app.delete("/deck/:id", (req, res) => {
			let deckId = req.params.id;
			new sql.Request().query(`delete from [dbo].[Deck] where [Id] = ${deckId}`, (err, result) => {
				res.json({
					isDeck: result.rowsAffected[0]
				});
			});
		});
	}
}

module.exports = DeleteDeckRoute;
