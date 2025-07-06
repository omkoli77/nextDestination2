const express = require("express");
const router = express.Router({mergeParams: true});
const {wrapAsync} = require("../util/wrapAsync.js");
const {reviewValidation, authentication, isReviewOwner} = require("../util/middlewear.js");
const { createReview, deleteReview } = require("../controllers/review.js");

//craete new review
router.post("/", authentication, reviewValidation, wrapAsync(createReview));

//delete review
router.delete("/:reviewId", authentication, isReviewOwner, wrapAsync(deleteReview));

module.exports = {reviewRouter: router}