const sql = require("mssql");

class DeleteCardTypeRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}
	
	initialize() {
		this.deleteCardTypeFromDatabase();
	}
	
	deleteCardTypeFromDatabase() {
		this.app.delete("/card-types/:id", (req, res) => {
			let cardTypeId = req.params.id;
			new sql.Request().query(`delete from [dbo].[CardType] where [Id] = ${cardTypeId}`, (err, result) => {
				let isCardType = result.rowsAffected[0];
				if (isCardType == 0) {
					res.json({
						isCardType
					});
				} else {
					new sql.Request().query(`delete from [dbo].[Card] where [CardTypeId] = ${cardTypeId}`, (err, result) => {
						let countCards = result.rowsAffected[0];
						// if (countCards == 0) {
							res.json({
								isCardType,
								countCards,
							});
						// } 
						// else {
						// 	new sql.Request().query(`delete from [dbo].[Deck] where [CardId] = ${cardId}`, (err, result) => {
						// 		res.json({
						// 			isCardType,
						// 			countCards,
						// 			countDecks: result.rowsAffected[0];
						// 		});
						// 	});
						// }
					});
				}
			});
		});
	}
}

module.exports = DeleteCardTypeRoute;
