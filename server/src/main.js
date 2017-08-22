const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const AddCardType = require("./routes/add-card-type/AddCardRoute");
const addCardType = new AddCardType(app);
addCardType.initialize();

const Dashboard = require("./routes/sample/SampleRoute");
const dashboard = new Dashboard(app);
dashboard.initialize();

const NumberOfPacksRoute = require("./routes/open-packs/NumberOfPacksRoute");
const noPacksRoute = new NumberOfPacksRoute(app);
noPacksRoute.initialize();

const ViewCardTypes = require("./routes/view-card-types/GetAllCardTypesRoute");
const viewCardTypes = new ViewCardTypes(app);
viewCardTypes.initialize();

const OpenPackRoute = require("./routes/open-packs/OpenPackRoute");
const openPackRoute = new OpenPackRoute(app);
openPackRoute.initialize();

const DeleteCardType = require("./routes/view-card-types/DeleteCardTypeRoute");
const deleteCardType = new DeleteCardType(app);
deleteCardType.initialize();

const GetDeckRoute = require("./routes/view-deck/GetDeckRoute");
const getDeckRoute = new GetDeckRoute(app);
getDeckRoute.initialize();

const DeleteDeckRoute = require("./routes/view-deck/DeleteDeckRoute");
const deleteDeckRoute = new DeleteDeckRoute(app);
deleteDeckRoute.initialize();

const EditDeckRoute = require("./routes/view-deck/EditDeckRoute");
const editDeckRoute = new EditDeckRoute(app);
editDeckRoute.initialize();

const GetAllCardsForDeckRoute = require("./routes/view-deck/GetAllCardsForDeckRoute");
const getAllCardsForDeckRoute = new GetAllCardsForDeckRoute(app);
getAllCardsForDeckRoute.initialize();

const GetCardsRoute = require("./routes/add-deck/GetCardsRoute");
const getCardsRoute = new GetCardsRoute(app);
getCardsRoute.initialize();

const AddDeckRoute = require("./routes/add-deck/AddDeckRoute");
const addDeckRoute = new AddDeckRoute(app);
addDeckRoute.initialize();

const DBConnection = require("./database-connection/DBConnection");
const dbConnection = new DBConnection();

app.listen(3000, function() {
	dbConnection.connect();
	console.log("CardType server listening on port 3000!");
});

dbConnection.close();
