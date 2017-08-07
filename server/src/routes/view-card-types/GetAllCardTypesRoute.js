const sql = require("mssql");
class GetAllCardTypesRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}
	
	initialize() {
		this.configureConnection();
		this.getAllcardTypesFromDatabase();
	}
	
	configureConnection() {
		const config = {
			user: "test",
			password: "test",
			server: "localhost",
			database: "CardGame",
			port: 50209
		};
		return config;
	}
	
	getAllcardTypesFromDatabase() {
		const config = this.configureConnection();
		let count = 0;
		this.app.get("/view-card-types/", (req, res) => {
			sql.connect(config, err => {
				if (err) {
					res.status(500).send(err);
					sql.close();
				}
				let search = req.query.searchName;
				let index = req.query.pageIndex;
				new sql.Request().query(`select count(*) as number from [dbo].[CardType] where [Name] like '%${search}%'`, (err, result) => {
					count = result.recordset[0].number;
				});
				new sql.Request().query(`select * from [dbo].[CardType] WHERE [Name] LIKE '%${search}%' order by [Id] desc OFFSET ${index} ROWS FETCH NEXT 10 ROWS ONLY`, (err, result) => {
				// new sql.Request().query(`select * from [dbo].[CardType] order by [Id] desc`, (err, result) => {
					res.json({
						count,
					 	cardTypes: result.recordset
					});
					sql.close();
				});
			});
			
			sql.on("error", err => {
				res.status(500).send(err);
				sql.close();
			});
		});
	}
}

module.exports = GetAllCardTypesRoute;
