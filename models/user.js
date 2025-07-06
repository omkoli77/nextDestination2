const mongoose = require("mongoose");
const {Schema} = mongoose;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String
    }
});

UserSchema.pre("save", async function (next){
    if(!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

UserSchema.methods.validatePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

// create refreash token
UserSchema.methods.createRefreshToken= function (){
    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            email: this.email
        },
        "jwtScreate",
        {
            expiresIn: "7d"
        }
    );
}

// create access token
UserSchema.methods.createAccessToken= function (){
    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            email: this.email,
            password: this.password
        },
        "jwtScreate",
        {
            expiresIn: "1h"
        }
    );
}

exports.User = mongoose.model("User", UserSchema);

