const mongoose = require("mongoose");
const {Schema} = mongoose;


const reviewSchema = new Schema({
    content: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    createdAt: {
        type: Date,
        default: new Date(Date.now())
    }
});

exports.Review = mongoose.model("Review", reviewSchema);
