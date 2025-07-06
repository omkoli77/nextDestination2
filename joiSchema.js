const joi = require("joi");

exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        url: joi.string(),
        price: joi.number().min(0).required(),
        location: joi.string().required(),
        country: joi.string().required(),
        category: joi.string().required()
    }).required()
});

exports.reviewSchema = joi.object({
    review: joi.object({
        content: joi.string().required(),
        rating: joi.string().min(1).max(5).required()
    }).required()
});

exports.userSchema = joi.object({
    user: joi.object({
        username: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
    }).required()
});