const foodModel = require("../models/foodModel");

const orderModel = require("../models/orderModel");

const createFoodController = async (req, res) => {

    try {
        const food = await foodModel.create({
            ...req.body,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            message: "Food created successfully",
            food
        });
        await food.save();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getAllFoodsController = async (req, res) => {

    try {
        const foods = await foodModel.find();
        if (!foods) {
            return res.status(404).json({
                success: false,
                message: "No foods found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Foods fetched successfully",
            foods
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const updateFoodController = async (req, res) => {

    try {
        const { title, description, price, category, image } = req.body;

        const food = await foodModel.findByIdAndUpdate(
            req.params.id,
            { title, description, price, category, image },
            { new: true, runValidators: true }
        );
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Food updated successfully",
            food
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const deleteFoodController = async (req, res) => {

    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }
        await foodModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Food deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
const orderFoodController = async (req, res) => {
    try {
        const { restaurant, foodItems } = req.body;

        // Check required fields
        if (!restaurant || !foodItems || foodItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide restaurant and food items"
            });
        }

        let totalAmount = 0;
        const orderFoodItems = [];

        // Process every food item
        for (const item of foodItems) {

            const { foodId, quantity } = item;

            // Validate quantity
            if (!foodId || !quantity || quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid food ID or quantity"
                });
            }

            // Find food
            const food = await foodModel.findById(foodId);

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: `Food not found: ${foodId}`
                });
            }

            // Check availability
            if (!food.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `${food.title} is currently unavailable`
                });
            }

            // Make sure food belongs to selected restaurant
            if (food.restaurant.toString() !== restaurant) {
                return res.status(400).json({
                    success: false,
                    message: `${food.title} does not belong to this restaurant`
                });
            }

            // Calculate item subtotal
            const itemTotal = food.price * quantity;

            // Add to total
            totalAmount += itemTotal;

            // Add food to order
            orderFoodItems.push({
                food: food._id,
                quantity: quantity
            });
        }

        // Create order
        const order = await orderModel.create({
            user: req.user.id,
            restaurant: restaurant,
            foodItems: orderFoodItems,
            totalAmount: totalAmount
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const validStatuses = [
  "pending",
  "accepted",
  "preparing",
  "on the way",
  "delivered",
  "cancelled"
];

const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "orderId and status are required"
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true, context: "query" }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = 
{ createFoodController, 
    getAllFoodsController, 
    updateFoodController, deleteFoodController, orderFoodController, updateOrderStatusController };