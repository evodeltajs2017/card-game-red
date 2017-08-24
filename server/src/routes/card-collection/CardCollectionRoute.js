const sql = require("mssql");

class CardCollectionRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}

	initialize() {
		this.getCards();
	}

	getCards() {
		this.app.get("/card-collection/", (req, res) => {
			let search = req.query.searchName
			let index = req.query.pageIndex;
			let increment = 14;
			let paramCheck = this.checkParams(req, res);

			if (paramCheck.response == "200") {
				new sql.Request().query(`select count(*) as number FROM [dbo].[Card] inner join [CardType] on [Card].[CardTypeId]=[CardType].[Id]${paramCheck.searchQuery}`, (err, result) => {
					let count = Math.ceil(result.recordset[0].number / increment);
					if (count >= index) {
						new sql.Request().query(`select [Card].[Id], [Card].[CardTypeId], [CardType].[Name], [CardType].[Cost], [CardType].[Damage], [CardType].[Health], [CardType].[ImageIdentifier] 
												FROM [dbo].[Card] inner join [CardType] on [Card].[CardTypeId]=[CardType].[Id]${paramCheck.searchQuery} ORDER BY [Id] DESC OFFSET ${index * increment} 
												ROWS FETCH NEXT ${increment} ROWS ONLY`,
						(err, result) => {
							if (err) {
								console.log(err);
								return;
							}
							res.json({Cards: result.recordset, Pages: count});
						});
					}
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
		let searchQuery = ` where [CardType].[Name] like '%${search}%'`;

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