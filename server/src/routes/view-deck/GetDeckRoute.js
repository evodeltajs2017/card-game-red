const sql = require("mssql");

class GetDeckRoute {
	constructor(expressApp) {
		this.app = expressApp;
		this.GOOD_RESPONSE = "200";
	}
	
	initialize() {
		this.getDecksFromDatabase();
	}
	
	getDecksFromDatabase() {
		let count = 0;
		this.app.get("/view-deck/", (req, res) => {
			let search = req.query.searchName;
			let index = req.query.pageIndex;
			let paramCheck = this.checkParams(req, res);
			if (this.GOOD_RESPONSE === paramCheck.response) {
				new sql.Request().query(`select count(*) as number from [dbo].[Deck]${paramCheck.query}`, (err, result) => {
					count = result.recordset[0].number;
				});
				new sql.Request().query(`select * from [dbo].[Deck]${paramCheck.query} order by [Id] OFFSET ${index} ROWS FETCH NEXT 10 ROWS ONLY`, (err, result) => {
					res.json({
						count,
					 	items: result.recordset,
					 	test: paramCheck.query
					});
				});
			} else {
				return;
			}
		});
	}

	checkParams(req, res) {
		let search = req.query.searchName;
		let index = req.query.pageIndex;
		let response = "200";
		let query = ` where [Name] like '%${search}%'`;
		if (index == "undefined" || index == "") {
			res.status(400).send();
			response = "400";
		}
		if (search === "" || search === undefined) {
			query = "";
		}
		return { response, query };
	} 

}

module.exports = GetDeckRoute;
