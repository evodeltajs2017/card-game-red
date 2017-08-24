const sql = require("mssql");

class GetCardsRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}
	
	initialize() {
		this.getCardsFromDatabase();
	}
	
	getCardsFromDatabase() {
		this.app.get("/add-deck/", (req, res) => {
			new sql.Request().query(`select [Card].[Id], [Card].[CardTypeId], [CardType].[Name], [CardType].[Cost], [CardType].[Damage], [CardType].[Health], [CardType].[ImageIdentifier] from [dbo].[Card] inner join [CardType] on [Card].[CardTypeId]=[CardType].[Id] order by [CardType].[Name]`, (err, result) => {
				res.json({
					 	items: result.recordset,
				});
			});

		});
	}

}

module.exports = GetCardsRoute;
