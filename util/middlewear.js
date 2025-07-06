const { listingSchema, reviewSchema, userSchema } = require("../joiSchema");
const { ExpressError } = require("./expressError");
const {Listing} = require("../models/listings.js");
const {Review} = require("../models/reviews.js");
//this required for authentication
const jwt = require("jsonwebtoken");
const { User } = require("../models/index.js");
const { wrapAsync } = require("./wrapAsync.js");

function listingValidation(req, res, next) {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    } else { next() };
};

function reviewValidation(req, res, next) {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    } else { next() };
}

function userValidation(req, res, next) {
    let { error } = userSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    } else { next() };
};

//isowner Listing function 
async function isOwner(req, res, next) {
    let listing1 = await Listing.findById(req.params.id);
    if (listing1.owner.toString() !== req.user._id.toString()) {
        req.flash("error", "You Not Authorized For Listing");
        return res.redirect(`/listings/${req.params.id}`);
    };
    next()
}

//is owner reviews
async function isReviewOwner(req, res, next) {
    let review = await Review.findById(req.params.reviewId);
    if (review.owner.toString() !== req.user._id.toString()) {
        req.flash("error", "You Not Authorized For Delete This Review");
        return res.redirect(`/listings/${req.params.listingId}`);
    };
    next()
}

//authentication middlewear
let authentication = wrapAsync(async (req, res, next) => {
    req.session.originalUrl = req.originalUrl;
    let accessToken = req.cookies.accessToken;
    if (!accessToken) {
        req.flash("error", "User Not Authenticat");
        return res.redirect("/users/login");
    }
    let decodedAccessToken;

    try {
        decodedAccessToken = jwt.verify(accessToken, "jwtScreate");
    }
    catch (error) {
        if (error.message === "jwt expired") {
            return res.redirect("/users/tokens/refresh");
        }
        req.flash("error", error.message)
        return res.redirect("/users/login");
    };

    // if(!decodedAccessToken) return res.send("access token not decoded");
    let user = await User.findById(decodedAccessToken.id).select("-password -refreshToken");
    if (!user) {
        req.flash("error", "Invalid AccessToken");
        return res.redirect("/users/login");
    }
    req.user = user;
    next();
});

let authentication1 = wrapAsync(async (req, res, next) => {
    let accessToken = req.cookies.accessToken;
    if (!accessToken) { res.locals.curentUser = "ok"; return next() };
    let decodedAccessToken;
    try {
        decodedAccessToken = jwt.verify(accessToken, "jwtScreate");
    }
    catch (err) { res.locals.curentUser = "ok"; return next() };
    let user = await User.findById(decodedAccessToken.id).select("-password -refreshToken");
    if (!user) { res.locals.curentUser = "ok"; return next() };
    res.locals.curentUser = user;
    next();
});




module.exports = { listingValidation, reviewValidation, userValidation, authentication, authentication1, isOwner, isReviewOwner };

















// let sample = wrapAsync(async (req, res, next)=>{
//     let accessToken = req.cookies.accessToken;
//     if(!accessToken) return res.send("user not authenticat");
//     let decodedAccessToken = jwt.verify(accessToken, "jwtScreate");
//     if(!decodedAccessToken) return res.send("Invalid credentials");
//     let user = await User.findById(decodedAccessToken.id).select("-password -refreshToken");
//     if(!user) return res.send("Invalid AccessToken");
//     console.log(user);
//     next();
// });



// async function authentication (req, res, next){
//     let accessToken = req.cookies.accessToken;
//     if(!accessToken) return res.send("user not authenticat");
//     let decodedAccessToken = jwt.verify(accessToken, "jwtScreate");
//     if(!decodedAccessToken) return res.send("Invalid credentials");
//     let user = await User.findById(decodedAccessToken.id).select("-password -refreshToken");
//     if(!user) return res.send("Invalid AccessToken");
//     console.log(user);
//     next();
// }