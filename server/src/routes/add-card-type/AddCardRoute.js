const sql = require("mssql");

class AddCardRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}

	initialize() {

		this.postRequest( (data, res) => {
			let validData = this.validateInputs(data, res);

			if (validData) {
				this.insertCardInDb(data, res);
			} 
		});
	}

	postRequest(callback) {
		this.app.post("/add-card-type", (req, res) => { callback(req.body, res) });
	}

	validateInputs(data, res) {
		let reqArr = Object.keys(data).map(k => data[k]);
		let notValidArr = [];
		const reqArrLength = reqArr.length;

		for (let i = 0; i < reqArrLength; i++) {
			if (reqArr[i] === null || reqArr[i] === "") {
				notValidArr.push(reqArr[i]);
			}
		}

		if (notValidArr.length > 0) {
			res.json("Card not added. Please fill out all the fields.");
		} else {
			return true;
		}
	}

	insertCardInDb(data, res) {

		new sql.Request().query(
			`INSERT INTO [dbo].[CardType] (Name, Cost, Damage, Health, ImageIdentifier) 
			VALUES('${data.Name}', ${data.Cost}, ${data.Damage}, ${data.Health}, '${data.ImageIdentifier}');`, 
			(err, result) => {
				if (err) {
					console.log(err);
					return;
				}
				res.json("Card added successfully!");
			});
	}
}

module.exports = AddCardRoute;