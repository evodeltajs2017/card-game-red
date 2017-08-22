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
			let cardIds = req.body.cardIds;
			new sql.Request().query(`update [dbo].[Deck] set [Name] = '${deckName}' where Id = ${deckId}`, (err, result) => {
				new sql.Request().query(`delete from [dbo].[DeckCard] where [DeckId] = ${deckId}`, (err, result) => {
					let insertData = "";
					for (let i = 0; i < cardIds.length; i++) {
						if (i + 1 == cardIds.length) {
							insertData += `(${deckId}, ${cardIds[i]})`;
						} else {
							insertData += `(${deckId}, ${cardIds[i]}), `;
						}
					}
					new sql.Request().query(`insert into [dbo].[DeckCard] ([DeckId], [CardId]) values ${insertData}`, (err, result) =>{
						res.json({
							status: result.rowsAffected[0]
						});
					});
				});
			});
		});
	}
}

module.exports = EditDeckRoute;
