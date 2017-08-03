const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const SampleRoute = require("./routes/sample/SampleRoute");
const sampleRoute = new SampleRoute(app);
sampleRoute.initialize();

const ViewCardTypes = require("./routes/view-card-types/GetAllCardTypesRoute");
const viewCardTypes = new ViewCardTypes(app);
viewCardTypes.initialize();

app.listen(3000, function() {
	console.log("Example app listening on port 3000!");
});
