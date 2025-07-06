const express = require("express");
const router = express.Router();
const {wrapAsync} = require("../util/wrapAsync.js");
const {listingValidation, isOwner} = require("../util/middlewear.js");
const { authentication } = require("../util/middlewear");
const {index, newListingSave, showListing, editListing, updateListing, deleteListing, listingFormRender, searchListing} = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudinary.config.js");
const upload = multer({ storage: storage });


//create new listing from
router.get("/new", authentication, listingFormRender);

//search listing
router.post("/search", wrapAsync(searchListing));

router.route("/")
//all listings show
.get(wrapAsync(index))
//create new listing update
.post(authentication, upload.array("listing[image]"), listingValidation, wrapAsync(newListingSave));

router.route("/:id")
//show single listing
.get(wrapAsync(showListing))
//edit listing update
.put(authentication, isOwner, upload.single("listing[url]"), listingValidation, wrapAsync(updateListing));

//edit listing form
router.get("/:id/edit", authentication, isOwner, wrapAsync(editListing));

//delete listing
router.delete("/:id", authentication, isOwner, wrapAsync(deleteListing));


module.exports = {listingRouter: router};