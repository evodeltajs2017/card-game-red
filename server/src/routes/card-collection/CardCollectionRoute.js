const sql = require("mssql");

class CardCollectionRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}

	initialize() {
		this.getCards();
		
	}

	getCards() {
		let count = 0;
		this.app.get("/card-collection/", (req, res) => {
			let search = req.query.searchName
			let index = req.query.pageIndex;
			let increment = 14;
			let paramCheck = this.checkParams(req, res);

			if (paramCheck.response = "200") {
				new sql.Request().query(`select count(*) as number from [dbo].[CardType]${paramCheck.searchQuery}`, (err, result) => {
					count = Math.ceil(result.recordset[0].number / increment);
				});
				
				if (count >= index) {
					new sql.Request().query(`SELECT * FROM [dbo].[CardType]${paramCheck.searchQuery} ORDER BY [Id] DESC OFFSET ${index * increment} 
											ROWS FETCH NEXT ${increment} ROWS ONLY`,
					(err, result) => {
						if (err) {
							console.log(err);
							return;
						}
						res.json({Cards: result.recordset, Pages: count});
					});
				}
			} else {
				return;
			}
		});
	}

	checkParams(req, res) {
		let search = req.query.searchName;
		let index = req.query.pageIndex;
		let response = "200";
		let searchQuery = ` where [Name] like '%${search}%'`;

		if (index == "undefined" || index == "") {
			res.status(400).send();
			response = "400";
		}
		if (search === "" || search === undefined) {
			searchQuery = "";
		}
		return { response, searchQuery };
	}
}

module.exports = CardCollectionRoute;