const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    address: {
        type: Array,
        required: [true, "Please provide an address"]
    }, 
    phone: {
        type: Number,
        required: [true, "Please provide a phone number"]
    },
    userType: {
        type: String,
        required: [true, "Please provide a user type"],
        default: "client",
        enum: ["user", "admin", "client", "driver"]
    },
    profile: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/21/21104.png"
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);