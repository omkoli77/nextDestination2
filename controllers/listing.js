const { Listing } = require("../models");

exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render("./listing/index.ejs", { listings });
};

exports.listingFormRender = (req, res) => {
    res.render("./listing/new.ejs");
};

exports.newListingSave = async (req, res, next) => {
    let images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    let listing = req.body.listing;
    let newListing = await new Listing({...listing, image: images, owner: req.user._id});
    let ans = await newListing.save();
    req.flash("success", "New Listing Created Success Fully....!")
    res.redirect("/listings");
};

exports.showListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).populate({ path: "reviews", populate: "owner" }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing You Requested For Does Not Exists....!");
        return res.redirect("/listings");
    };
    res.render("./listing/show.ejs", { listing });
};

exports.editListing = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let imgUrl = listing.image[0].url.replace("/upload", "/upload/h_200,w_300");
    res.render("./listing/edit.ejs", { listing, imgUrl });
};

exports.updateListing = async (req, res, next) => {
    let listing = req.body.listing;
    if (req.file) {
        let listingO = await Listing.findById(req.params.id);
        let { path: url, filename } = req.file;
        let obj = { url, filename };
        if(listingO.image.length>4){await Listing.findByIdAndUpdate(req.params.id, {$pop: {image: 1}});}
        await Listing.findByIdAndUpdate(req.params.id, {$push: {image: obj}});
    };
    await Listing.findByIdAndUpdate(req.params.id, listing, { runValidators: true });
    req.flash("success", "Listing New Changes Updated Success Fully....!");
    res.redirect("/listings");
};

exports.deleteListing = async (req, res) => {
    const deleteListing = await Listing.findByIdAndDelete(req.params.id);
    req.flash("error", "Listing Deleted Success Fully....!");
    res.redirect("/listings");
};

exports.searchListing = async (req, res) => {
    let { search } = req.body;
    let listings = await Listing.find({ $or: [{ location: search }, { title: search }] });
    res.render("./listing/index.ejs", { listings });
}