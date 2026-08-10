const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};