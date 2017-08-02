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

				new sql.Request().query(`INSERT dbo.CardType(Name, Cost, Damage, Health, ImageIdentifier)  
									    VALUES('University', 4, 4, 3,'fa-university'),
										('Car', 3, 3, 2,'fa-car'),
										('Bell', 1, 0, 0,'fa-bell-o'),
										('Cubes', 5, 3, 2,'fa-cubes'),
										('Gift', 3, 1, 0,'fa-gift');
										GO`, 
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