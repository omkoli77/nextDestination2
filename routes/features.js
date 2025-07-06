const express = require("express");
const router = express.Router();
const {Listing} = require("../models/listings.js");

router.route("/:category")
.get(async(req, res)=>{
    let {category} = req.params;
    const listings = await Listing.find({category: category});
    console.log(category);
    res.render("./listing/index.ejs", {listings});
});

module.exports = {featuresRouter: router};