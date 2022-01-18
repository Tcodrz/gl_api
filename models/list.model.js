"use strict";

const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
    sName: String,
    items: [{
        sName: String,
        iAmount: Number,
        dCreated: Date,
        sListID: String,
        bChecked: Boolean,
    }],
    dCreated: {
        type: Date,
        default: new Date(),
    },
    dLaseUpdateed: {
        type: Date,
        default: new Date(),
    },
});

const ListModel = mongoose.model('list', ListSchema);

module.exports = ListModel;
