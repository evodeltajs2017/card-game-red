const sql = require("mssql");
const CardValidations = require("./CardValidations");

class AddCardRoute {
	constructor(expressApp) {
		this.app = expressApp;
	}

	initialize() {

		this.postRequest( (data, res) => {
			const validation = new CardValidations();
			validation.isNameUnique = (data, (data, callback) => { this.isNameUnique(data, callback); });
			validation.validateCard(data, (newCard) => {	

				if (newCard._error === true) {	
					res.json(newCard);
				} else {
					this.insertCardInDb(data, res);
				}
			});

		})
		
	}

	postRequest(callback) {
		this.app.post("/add-card-type", (req, res) => { callback(req.body, res); });
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
				res.json("success");
			});
	}

	isNameUnique(name, callback) {
		new sql.Request().query(
			`SELECT Name FROM [dbo].[CardType] WHERE Name LIKE '${name}';`,
			(err, result) => {
				if (err) {
					console.log(err);
					return;
				} 
				if (result.recordset.length > 0) {
					callback(false);
				} else {
					callback(true);
				}
			});
	}
}

module.exports = AddCardRoute;