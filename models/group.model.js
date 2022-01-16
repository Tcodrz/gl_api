"use strict";

const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    sName: String,
    aGroupMembersIDs: [String],
    aListIDs: [String],
    sAdminID: String,
    aAllowedUsersEmails: [String],
    dCreate: {
        type: Date,
        default: new Date()
    },
});
const GroupModel = mongoose.model('group', GroupSchema);

module.exports = GroupModel;
