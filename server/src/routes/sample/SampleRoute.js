const sql = require("mssql");

class SampleRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}

	initialize() {
		const config = {
			user: "test",
			password: "test",
			server: "localhost",
			database: "CardGame"
		};

		this.app.get("/sample", (req, res) => {
			sql.connect(config, err => {
				if (err) {
					res.status(500).send(err);
				}

				new sql.Request().query("select * from [dbo].[User]", (err, result) => {
					res.send(result);
				});
			});

			sql.on("error", err => {
				res.status(500).send(err);
			});
		});

		this.app.get("/sample-ok", (req, res) => {
			res.json({ UnopenedCardPacks: 1 });
		});
	}
}

module.exports = SampleRoute;