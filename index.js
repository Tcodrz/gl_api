"use strict";

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const enviorment = require("./environment/environmnet");
const lists_routes = require("./routes/lists.routes");
const user_routes = require("./routes/user.routes");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.get('/api', (req, res) => {
    return res.status(200).json({
        message: 'Server Health Check OK'
    });
});

app.use('/api/lists', lists_routes);
app.use('/api/users', user_routes);

console.log(enviorment.env);

try {
    const sConnectionString = enviorment.env.production ? enviorment.env.dbCloudURI : enviorment.env.dbLocalURI;
    mongoose.connect(sConnectionString).then(() => {
        console.log('MongoDB Connected');
    });
    app.listen(port, () => {
        console.log('Server Listening on port ' + port);
    });
}
catch (error) {
    console.error(`Error ${error.message}`);
}
