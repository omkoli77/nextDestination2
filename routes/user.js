const express = require('express');
const router = express.Router();
const { userValidation } = require("../util/middlewear");
const { wrapAsync } = require("../util/wrapAsync");
const { authentication } = require("../util/middlewear");
const {signupRenderForm, signupUser, loginRenderForm, userLogin, userLogout, userTokensRefresh} = require("../controllers/user.js");

router.route("/signup")
// register form render 
.get(signupRenderForm)
// user register post save
.post(userValidation, wrapAsync(signupUser));

router.route("/login")
//user login form
.get(loginRenderForm)
// user login post
.post(wrapAsync(userLogin));

// user logout
router.get("/logout", authentication, wrapAsync(userLogout));

// users tokens refresh
router.get("/tokens/refresh", wrapAsync(userTokensRefresh));

module.exports = { userRouter: router };