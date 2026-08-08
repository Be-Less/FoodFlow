const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a food name"],
        unique: true
    },
    image: {
        type: String,
        required: [true, "Please provide a food image"],
        default: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
    },
    description: {  
        type: String,
        required: [true, "Please provide a food description"]
    },
    price: {
        type: Number,
        required: [true, "Please provide a food price"]
    },
    isAvailable: {
        type: Boolean,
        required: [true, "Please provide food availability status"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Please provide a category"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Food", foodSchema);