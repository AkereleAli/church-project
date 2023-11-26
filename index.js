require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.SERVER_PORT;
app.use(cors());
const displayRoutes = require('express-routemap');
const routes = require('./routes');
app.use(bodyParser.json());
app.use('/api', routes);


app.listen(port, () => {
    console.log(`app listening at port ${port}`);
    displayRoutes(app)
})