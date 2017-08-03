const sql = require("mssql");

class AddCardRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}

	initialize() {

		this.configureConnection();
		this.insertCardInDb();
	}

	configureConnection() {
		const config = {
			user: "test",
			password: "test",
			server: "localhost",
			database: "CardGame",
			port: 50217
		};

		return config;
	}

	insertCardInDb() {
		const config = this.configureConnection();

		this.app.post("/add-card-type", (req, res) => {
			sql.connect(config, err => {
				if (err) {
					res.status(500).send(err);
					sql.close();
				}

				new sql.Request().query(`INSERT INTO [dbo].[CardType] (Name, Cost, Damage, Health, ImageIdentifier) 
										VALUES('${req.body.Name}', ${req.body.Cost}, ${req.body.Damage}, ${req.body.Health}, '${req.body.ImageIdentifier}');`, 
										(err, result) => {
											res.json(result);
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

module.exports = AddCardRoute;