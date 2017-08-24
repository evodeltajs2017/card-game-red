const sql = require("mssql");

class GenerateDeckRoute {
    constructor(expressApp) {
        this.app = expressApp;
    }

    initialize() {
        this.app.get("/generateDeck", (req, res) => {

            let cards = [];
            let deck = [];
            new sql.Request().query("select [dbo].[CardType].Name, [dbo].[CardType].Cost, [dbo].[CardType].Damage," +
                "[dbo].[CardType].Health, [dbo].[CardType].ImageIdentifier " +
                "from [dbo].[Card] inner join [dbo].[CardType] on [dbo].[Card].CardTypeId = [dbo].[CardType].Id", (err, result) => {
                    cards = result.recordset;
                    if (cards === undefined || cards.length === 0){
                        cards = [];
                        res.json(cards);
                        return;
                    }
                    deck = this.generateRandomDeck(cards);
                    res.json(deck);
            });

        });
    }

    generateRandomDeck(cards){
        let deck = [];

        for(let i=0; i<30; i++){
            let randCard = cards[Math.floor(Math.random() * cards.length)];
            deck.push(randCard);
        }
        return deck;
    }
}

module.exports = GenerateDeckRoute;