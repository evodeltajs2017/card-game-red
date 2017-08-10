const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SampleRoute = require("./routes/sample/SampleRoute");
const sampleRoute = new SampleRoute(app);
sampleRoute.initialize();

const NumberOfPacksRoute = require("./routes/open-packs/NumberOfPacksRoute");
const noPacksRoute = new NumberOfPacksRoute(app);
noPacksRoute.initialize();

const ViewCardTypes = require("./routes/view-card-types/GetAllCardTypesRoute");
const viewCardTypes = new ViewCardTypes(app);
viewCardTypes.initialize();

const OpenPackRoute = require("./routes/open-packs/OpenPackRoute");
const openPackRoute = new OpenPackRoute(app);
openPackRoute.initialize();

const DBConnection = require("./database-connection/DBConnection");
const dbConnection = new DBConnection();

app.listen(3000, function() {
	dbConnection.connect();
	console.log("CardType server listening on port 3000!");
});

dbConnection.close();
