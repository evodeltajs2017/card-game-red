const sql = require("mssql");

class GetAllCardTypesRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}
	
	initialize() {
		this.getAllCardTypesFromDatabase();
	}
	
	getAllCardTypesFromDatabase() {
		let count = 0;
		this.app.get("/view-card-types/", (req, res) => {
			let search = req.query.searchName;
			let index = req.query.pageIndex;
			if (search === undefined || index === undefined || index === "") {
				res.status(400).send();
				return;
			}
			new sql.Request().query(`select count(*) as number from [dbo].[CardType] where [Name] like '%${search}%'`, (err, result) => {
				count = result.recordset[0].number;
			});
			new sql.Request().query(`select * from [dbo].[CardType] WHERE [Name] LIKE '%${search}%' order by [Id] desc OFFSET ${index} ROWS FETCH NEXT 10 ROWS ONLY`, (err, result) => {
				res.json({
					count,
				 	cardTypes: result.recordset
				});
			});
		});
	}
}

module.exports = GetAllCardTypesRoute;
