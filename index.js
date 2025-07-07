if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
};
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const {ExpressError} = require("./util/expressError.js");
const {listingRouter} = require("./routes/listing.js");
const {reviewRouter} = require("./routes/review.js");
const {userRouter} = require("./routes/user.js")
const {featuresRouter} = require("./routes/features.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const {authentication1} = require("./util/middlewear.js");

let mongoUrl = process.env.MONGO_URL;

//mongodb server connected  
async function main(){
    mongoose.connect(mongoUrl)
    .then(()=>{
        console.log("mongodb server connected");
    })
    .catch((err)=>{
        console.log(err);
    });
};
main();

//middelewear 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

//session store in mongoAtlas
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600
});

//session option
const sessionOption = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge:1000*60*60,
    },
    httpOnly: true,
};
app.use(session(sessionOption));
app.use(flash());
app.get('/favicon.ico', (req, res) => res.status(204).end());


// Main routes
app.use(authentication1);
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:listingId/reviews", reviewRouter);
app.use("/users", userRouter);
app.use("/listings/features", featuresRouter);

// accept all request 
app.all("*", (req, res, next)=>{
    next( new ExpressError(404, "page not found"));
});

// custome error handlear
app.use((err, req, res, next)=>{
    let {status=500, message="something went to wrong"} = err;
    console.log(`Status :-${status}  ,Message :- ${message}`);
    res.status(status).render("error.ejs", {message});
});

app.listen(8080, ()=>{
    console.log("server is on port 8080");
});