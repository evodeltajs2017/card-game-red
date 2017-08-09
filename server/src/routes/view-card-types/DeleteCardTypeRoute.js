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
			let isCardType = 0;
			let countCards = 0;
			new sql.Request().query(`select count(*) as number from [dbo].[CardType] where [Id] like ${cardTypeId}`, (err, result) => {
					isCardType = result.recordset[0].number;
				});
			new sql.Request().query(`select count(*) as number from [dbo].[Card] where [CardTypeId] like ${cardTypeId}`, (err, result) => {
					countCards = result.recordset[0].number;
				});
			new sql.Request().query(`delete from [dbo].[Card] where [CardTypeId] like ${cardTypeId}`, (err, result) => {
				
				});
			new sql.Request().query(`delete from [dbo].[CardType] where [Id] like ${cardTypeId}`, (err, result) => {
				res.json({
					isCardType,
					countCards,
				});
			});
		});
	}
}

module.exports = DeleteCardTypeRoute;
