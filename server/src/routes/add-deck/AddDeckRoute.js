const sql = require("mssql");

class AddDeckRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}
	
	initialize() {
		this.addDeckToDatabase();
	}
	
	addDeckToDatabase() {
		this.app.post("/add-deck/", (req, res) => {
			let deckName = req.body.name;
			let cardId = req.body.id;
			new sql.Request().query(`insert into [dbo].[Deck] ([Name]) output INSERTED.Id values ('${deckName}')`, (err, result) => {
				let deckId = result.recordset[0].Id;
				let insertData = "";
				for (let i = 0; i < cardId.length; i++) {
					if (i + 1 == cardId.length) {
						insertData += `(${deckId}, ${cardId[i]})`;
					} else {
						insertData += `(${deckId}, ${cardId[i]}), `;
					}
				}
				new sql.Request().query(`insert into [dbo].[DeckCard] ([DeckId], [CardId]) values ${insertData}`, (err, result) =>{
					res.json({
						status: result.rowsAffected[0]
					});
				});
			});
		});
	}

}

module.exports = AddDeckRoute;
