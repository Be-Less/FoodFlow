const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a restaurant name"],
        unique: true
    },
    image: {
        type: String,
        required: [true, "Please provide a restaurant image"]
    },
    address: {
        type: String,
        required: [true, "Please provide a restaurant address"]
    },
    foodType: {
        type: String,
        required: [true, "Please provide a food type"],
        enum: ["veg", "non-veg", "both"]
    },
    time: {
        type: String,
        required: [true, "Please provide restaurant operating hours"],
        enum: [
            "10:00 AM - 10:00 PM",
            "11:00 AM - 11:00 PM",
            "12:00 PM - 12:00 AM"
        ]
    },
    rating: {
        type: Number,
        required: [true, "Please provide a restaurant rating"],
        min: 0,
        max: 5
    },
    isOpen: {
        type: Boolean,
        required: [true, "Please provide restaurant open status"]
    },
    deliveryTime: {
        type: String,
        required: [true, "Please provide restaurant delivery time"]
    },
    deliveryCharge: {
        type: Number,
        required: [true, "Please provide restaurant delivery charge"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true          // Recommended
    },
    coordinates: {
        id: String,
        lat: Number,
        lng: Number,
        address: String,
        title: String
    }

}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);