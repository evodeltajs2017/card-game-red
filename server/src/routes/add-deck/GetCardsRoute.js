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
			new sql.Request().query(`select * from [dbo].[Card]`, (err, result) => {
				let idQuery = "";
				for (let i = 0; i < result.recordset.length; i++) {
					if (i + 1 == result.recordset.length) {
						idQuery += result.recordset[i].CardTypeId;
						break;
					} else {
						idQuery += `${result.recordset[i].CardTypeId}, `; 
					}
				}
				new sql.Request().query(`select * from [dbo].[CardType] where [Id] in (${idQuery}) order by [Name]`, (err, result) => {
					res.json({
					 	items: result.recordset,
					});
				});
			});
		});
	}

}

module.exports = GetCardsRoute;
