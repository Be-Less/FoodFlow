const restaurantModel = require("../models/restaurantModel");

const createRestaurantController = async (req, res) => {

    try {

        const restaurant = await restaurantModel.create({
            ...req.body,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            restaurant
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

const getAllRestaurantsController = async (req, res) => {

    try {
        const restaurants = await restaurantModel.find();

        res.status(200).json({
            success: true,
            message: "Restaurants fetched successfully",
            restaurants
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

const deleteRestaurantController = async (req, res) => {

    try {
        const restaurant = await restaurantModel.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        await restaurantModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

module.exports = {
    createRestaurantController,
    getAllRestaurantsController,
    deleteRestaurantController
};