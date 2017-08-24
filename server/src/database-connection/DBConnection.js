class DBConnection{
    constructor(){
        this.sql = require('mssql');
        this.config = ({
            user: "demo_red",
            password: "demo_red",
            server: "localhost",
            database: "CardGameRed",
            port: 1858
        });
    }

    connect(){
        this.sql.connect(this.config, err => {
            if (err) {
                this.sql.close();
            }else{
                console.log("connected ok");
            }
        });

        this.sql.on("error", err => {
            this.sql.close();
        });
    }

    close(){
        console.log("connection closed");
        this.sql.close();
    }
}
module.exports = DBConnection;