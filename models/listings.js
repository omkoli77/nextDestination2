const mongoose = require("mongoose");
const {Schema} = mongoose;
const {review, Review} = require("./reviews");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    image: [{
         _id: false,
        filename: String,
        url: {
            type: String,
            default: "https://cdn.sanity.io/images/ocl5w36p/prod5/4686312004bbe6a9cdbf3d5274ce965aff91d119-4832x3577.jpg?w=480&auto=format&dpr=2",
            set: (v)=> v===""? "https://cdn.sanity.io/images/ocl5w36p/prod5/4686312004bbe6a9cdbf3d5274ce965aff91d119-4832x3577.jpg?w=480&auto=format&dpr=2":v
        },
    }],

    price:{
        type: Number,
        min: 0
    },

    location: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    category: {
        type: String,
        enum: ["trending", "rooms", "iconic city", "mountain", "castle", "amazing poll", "camping", "farms", "arctic"]
    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    await Review.deleteMany({_id: {$in: listing.reviews}});
});

exports.Listing = mongoose.model("Listing", listingSchema)