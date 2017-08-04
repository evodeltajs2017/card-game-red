const sql = require("mssql");

class OpenPackRoute {
    constructor(expressApp) {
        this.app = expressApp;
        this.cards = [];
    }


    initialize() {
        this.app.get("/openPack", (req, res) => {
            this.cards = [];
            this.checkCardPacksNumber(req, res);
        });
    }

    checkCardPacksNumber(req, res){
        new sql.Request().query("select * from [dbo].[User]", (err, result) => {
            if (result.recordset[0] !== 0){
                this.getTypes(req, res);
            }else{
                res.send("Error");
            }
        });
    }

    getTypes(req, res) {
        let types = [];

        new sql.Request().query("select * from [dbo].[CardType]", (err, result) => {
            types = result.recordset;
            this.generateRandomCards(req, res, types);
        });
    }

    generateRandomCards(req, res, types){

        for(let i=0; i<5; i++){
            let randType = types[Math.floor(Math.random() * types.length)];
            this.cards.push(randType);
        }
        this.addCards(req, res);
    }

    addCards(req, res) {
        let queryString = "";

        for(let i=0; i<this.cards.length; i++) {
            let type = this.cards[i].Id;
            queryString += `insert into [dbo].[Card] (CardTypeId, UserId) values (${type}, 1)`;
        }
        new sql.Request().query(queryString, (err, result) => {
            console.log("Added");
            this.decrementUnopenedCardPacks(req, res);
        });
    }

    decrementUnopenedCardPacks(req, res) {
        new sql.Request().query(`update [dbo].[User] set UnopenedCardPacks=UnopenedCardPacks-1 where Id=1`, (err, result) => {
            console.log("Decremented");
            res.json(this.cards);
            console.log("---Done opening---");
        });
    }
}

module.exports = OpenPackRoute;