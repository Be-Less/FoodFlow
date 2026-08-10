const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const adminMiddleware = require("../middlewares/adminMiddleware");

const { createFoodController, getAllFoodsController, updateFoodController, 
    deleteFoodController, orderFoodController, updateOrderStatusController } = require("../controllers/foodController");

const router = express.Router();

router.post("/createfood", authMiddleware, createFoodController);

router.get("/getfoods", authMiddleware, getAllFoodsController);

router.put("/updatefood/:id", authMiddleware, updateFoodController);

router.delete("/deletefood/:id", authMiddleware, deleteFoodController);

router.post("/orderfood", authMiddleware, orderFoodController);

router.post("/orderStatus/:id", adminMiddleware, authMiddleware, updateOrderStatusController);


module.exports = router;