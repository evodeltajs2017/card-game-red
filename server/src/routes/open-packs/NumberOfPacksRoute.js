const sql = require("mssql");

class NumberOfPacksRoute {
    constructor(expressApp) {
        this.app = expressApp;
    }

    initialize() {
        this.app.get("/unopenedCardPacks", (req, res) => {

            new sql.Request().query("select * from [dbo].[User]", (err, result) => {
                res.json(result.recordset[0]);
            });

        });
    }
}

module.exports = NumberOfPacksRoute;