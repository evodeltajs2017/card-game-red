class DBConnection {
    constructor() {
        this.sql = require('mssql');
        this.config = {
            user: "test",
            password: "test",
            server: "localhost",
            database: "CardGame",
            port: 50217
        };
    }

    connect() {
        this.sql.connect(this.config, err => {
            if (err) {
                this.sql.close();
                console.log(err);
            } else{
                console.log("connected ok");
            }
        });

        this.sql.on("error", err => {
            this.sql.close();
            console.log(err);
        });
    }

    close() {
        console.log("connection closed");
        this.sql.close();
    }
}
module.exports = DBConnection;