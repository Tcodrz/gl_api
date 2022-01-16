"use strict";

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const enviorment = require("./environment/environmnet");
const lists_routes = require("./routes/lists.routes");
const user_routes = require("./routes/user.routes");
const UserModel = require('./models/user.model');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.use('/api/lists', lists_routes);
app.use('/api/users', user_routes);

console.log(enviorment.env);

app.get('/api', async (req, res) => {
    try {

        const users = await UserModel.find();
        console.log(users);
        return res.status(200).send('<h1>Hello From Server</h1>' + users[0].sFirstName);
    } catch (error) {

        console.error(error);
        return res.status(500).send(error);
    }
});

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
