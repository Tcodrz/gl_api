"use strict";

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    sFirstName: String,
    sLastName: String,
    sEmail: String,
    sPassword: {
        type: String,
        required: true,
        select: false
    },
    aGroupIDs: [String],
    aListsIDs: [String],
    dCreated: {
        type: Date,
        default: new Date()
    }
});

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('sPassword'))
        return next(); // only hash the password if it has been modified (or is new)
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        if (!user.sPassword) return next();
        bcrypt.hash(user.sPassword, salt, function (err, hash) {
            if (err) return next(err);
            user.sPassword = hash; // override the cleartext password with the hashed one
            next();
        });
    });
});

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
