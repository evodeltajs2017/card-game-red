const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const AddCardType = require("./routes/add-card-type/AddCardRoute");
const addCardType = new AddCardType(app);
addCardType.initialize();

app.listen(3000, function() {
	console.log("Example app listening on port 3000!");
});