const sql = require("mssql");

class GetAllCardsForDeckRoute {

	constructor(expressApp) {
		this.app = expressApp;
		this.GOOD_RESPONSE = "200";
	}
	
	initialize() {
		this.getCardsFromDatabase();
	}
	
	getCardsFromDatabase() {
		this.app.get("/view-deck/:id", (req, res) => {
			let deckId = req.params.id;
			new sql.Request().query(`select * from [dbo].[DeckCard] where [DeckId] = ${deckId}; select * from [dbo].[Deck] where [Id] = ${deckId}`, (err, result) => {
				let cardIds = result.recordset;
				let cardIdQuery = "";
				for (let i = 0; i < cardIds.length; i++) {
					if (i + 1 == cardIds.length) {
						cardIdQuery += cardIds[i].CardId;
					} else {
						cardIdQuery += `${cardIds[i].CardId}, `;
					}
				}
				let queryCards = `select [Card].[Id], 
						[Card].[CardTypeId], 
						[CardType].[Name], 
						[CardType].[Cost], 
						[CardType].[Damage], 
						[CardType].[Health], 
						[CardType].[ImageIdentifier] 
					from [dbo].[Card] 
					inner join [CardType] on [Card].[CardTypeId]=[CardType].[Id] 
					where [Card].[Id]`;
				new sql.Request().query(`${queryCards} not in (${cardIdQuery}) order by [CardType].[Name]`, (err, result) => {
					let cardsNotUsed = result.recordset;
					new sql.Request().query(`${queryCards} in (${cardIdQuery}) order by [CardType].[Name]`, (err, result) => {
						let cardsUsed = result.recordset;
						new sql.Request().query(`select * from [dbo].[Deck] where [Id] = ${deckId}`, (err, result) => {
							let deckName = result.recordset[0].Name;
							res.json({
								deckName,
							 	cardsNotUsed,
							 	cardsUsed
							});
						});
					});
				});
			});
		});
	}

}

module.exports = GetAllCardsForDeckRoute;
