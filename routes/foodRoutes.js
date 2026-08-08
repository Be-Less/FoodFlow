const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const { createFoodController, getAllFoodsController, updateFoodController, 
    deleteFoodController, orderFoodController } = require("../controllers/foodController");

const router = express.Router();

router.post("/createfood", authMiddleware, createFoodController);

router.get("/getfoods", authMiddleware, getAllFoodsController);

router.put("/updatefood/:id", authMiddleware, updateFoodController);

router.delete("/deletefood/:id", authMiddleware, deleteFoodController);

router.post("/orderfood", authMiddleware, orderFoodController);



module.exports = router;