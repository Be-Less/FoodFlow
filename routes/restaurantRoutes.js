const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');

const { createRestaurantController,getAllRestaurantsController, 
    deleteRestaurantController } = require('../controllers/restaurantController');

const router = express.Router();

//create restaurant
router.post('/createRestaurant', authMiddleware, createRestaurantController);

router.get('/getRestaurants', authMiddleware, getAllRestaurantsController);

router.delete('/deleteRestaurant/:id', authMiddleware, deleteRestaurantController);

module.exports = router;

