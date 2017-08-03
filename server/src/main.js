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

app.listen(3000, function() {
	console.log("Example app listening on port 3000!");
});