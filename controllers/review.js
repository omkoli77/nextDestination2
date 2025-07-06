const {Listing, Review} = require("../models");


exports.createReview = async(req, res)=>{
    let newReview = new Review(req.body.review);
    newReview.owner = req.user._id;
    await newReview.save();
    await Listing.findByIdAndUpdate(req.params.listingId, {$push: {reviews: newReview._id}});
    res.redirect(`/listings/${req.params.listingId}`);
};

exports.deleteReview = async(req, res)=>{
    let {listingId, reviewId} = req.params;
    await Listing.findByIdAndUpdate(listingId, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${listingId}`);
};