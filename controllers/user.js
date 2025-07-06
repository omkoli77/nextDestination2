const {User} = require("../models");
const {ExpressError} = require("../util/expressError");
const jwt = require("jsonwebtoken");

let cookieOption = { httpOnly: true, secured: true};
//function create accesssToken and refreshToken
let createTokens = async (userId) => {
    try{
    let user = await User.findById(userId);
    let accesssToken = user.createAccessToken();
    let refreshToken = user.createRefreshToken();
    await User.findByIdAndUpdate(userId, { refreshToken: refreshToken });
    return { accesssToken, refreshToken };
    }
    catch(error){
        throw new ExpressError(500,error.message);
    }
};

exports.signupRenderForm = (req, res) => {
    res.render("./user/register.ejs");
};

exports.signupUser = async (req, res) => {
    let user = await new User(req.body.user);
    let user1 = await User.findOne({ $or: [{ username: user.username }, { email: user.email }] });
    if (user1) {
        req.flash("error", "User All Ready Exists");
        return res.redirect("/users/login");
    }
        await user.save();
        req.flash("success", "User Register Success Fully")
        let { refreshToken, accesssToken } = await createTokens(user._id);
        res.cookie("accessToken", accesssToken, cookieOption)
        res.cookie("refreshToken", refreshToken, cookieOption)
        if(req.session.originalUrl) return res.redirect(`${req.session.originalUrl}`);
        res.redirect("/listings");
};

exports.loginRenderForm = (req, res) => {
    res.render("./user/login.ejs");
};

exports.userLogin = async (req, res, next) => {
    let { username, password } = req.body;
    if (!username || !password) {
        req.flash("error", "UserName Or Email Is Required");
        return res.redirect("/users/login");
    };
    let user = await User.findOne({ $or: [{ username: username }, { email: username }] });
    if (!user) {
        req.flash("error", "User Does Not Exists...!");
        return res.redirect("/users/signup");
    };
    let ans = await user.validatePassword(password);
    if (!ans) {
        req.flash("error", "You Entered Wrong Password");
        return res.redirect("/users/login");
    };

    let { refreshToken, accesssToken } = await createTokens(user._id);
    console.log(req.session.originalUrl);
    req.flash("success", "Welcome Back To Next Destination...!")
    res.cookie("accessToken", accesssToken, cookieOption)
    res.cookie("refreshToken", refreshToken, cookieOption)
    if(req.session.originalUrl) return res.redirect(`${req.session.originalUrl}`);
    return res.redirect("/listings");
};

exports.userLogout = async(req, res, next) => {
    req.session.originalUrl = undefined;
    await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined });
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.redirect("/listings");
};

exports.userTokensRefresh = async(req, res, next) => {
    let refreshToken1 = req.cookies.refreshToken;
    if (!refreshToken1) {
        req.flash("error", "access token is expaired and refresh token is emapty");
        return res.redirect("/users/login");
    };
    let decodedRefresh;
    try {
        decodedRefresh = jwt.verify(refreshToken1, "jwtScreate");
    }
    catch (error) {
        if (error.message === "jwt expired") {
            req.flash("error", "access token and refresh token is expaired ");
            return res.redirect("/users/login");
        };
        req.flash("error", error.message)
        return res.redirect("/users/login");
    };

    let user = await User.findById(decodedRefresh.id);
    if(user.refreshToken !== refreshToken1){
        req.flash("error", "Invalid User Credentials");
        return res.redirect("/users/login"); 
    };
    let {accesssToken, refreshToken} = await createTokens(user._id)
    res.cookie("accessToken", accesssToken)
    res.cookie("refreshToken", refreshToken)
    if(req.session.originalUrl) return res.redirect(`${req.session.originalUrl}`);
    res.redirect("/listings");
};