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
			database: "CardGame",
			port: 1858
		};

		this.app.get("/sample", (req, res) => {
			sql.connect(config, err => {
				if (err) {
					res.status(500).send(err);
					sql.close();
				}

				new sql.Request().query("select * from [dbo].[User]", (err, result) => {
					res.json(result.recordset[0]);
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

module.exports = SampleRoute;