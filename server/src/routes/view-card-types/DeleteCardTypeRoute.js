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
					new sql.Request().query(`delete from [dbo].[Card] output DELETED.Id where [CardTypeId] = ${cardTypeId}`, (err, result) => {
						let cardIds = result.recordset;
						if (cardIds.length == 0) {
							res.json({
								isCardType,
								countCards: cardIds.length
							});
						} else {
							let cardIdQuery = "";
							for (let i = 0; i < cardIds.length; i++) {
								if (i + 1 == cardIds.length) {
									cardIdQuery += cardIds[i].Id;
								} else {
									cardIdQuery += `${cardIds[i].Id}, `;
								}
							}
							new sql.Request().query(`delete from [dbo].[DeckCard] output DELETED.DeckId where [CardId] in (${cardIdQuery})`, (err, result) => {
								let deckIds = result.recordset;
								if (deckIds.length == 0) {
									res.json({
										isCardType,
										countCards: cardIds.length
									});
								} else {
									let deckIdQuery = "";
									for (let i = 0; i < deckIds.length; i++) {
										if (i + 1 == deckIds.length) {
											deckIdQuery += deckIds[i].DeckId;
										} else {
											deckIdQuery += `${deckIds[i].DeckId}, `;
										}
									}
									new sql.Request().query(`delete from [dbo].[Deck] where [Id] in (${deckIdQuery})`, (err, result) => {
										new sql.Request().query(`delete from [dbo].[DeckCard] where [DeckId] in (${deckIdQuery})`, (err, result) => {
											res.json({
												isCardType,
												countCards: cardIds.length,
												countDecks: deckIds.length
											});
										});
									});									
								}
							});
						}
					});
				}
			});
		});
	}
}

module.exports = DeleteCardTypeRoute;