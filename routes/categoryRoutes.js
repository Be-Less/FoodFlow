const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const { createCategoryController, getAllCategoriesController, deleteCategoryController
    ,updateCategoryController
 } = 
require("../controllers/categoryController");

const router = express.Router();

router.post("/createCategory", authMiddleware, createCategoryController);

router.get("/getCategories", authMiddleware, getAllCategoriesController);

router.put("/updateCategory/:id", authMiddleware, updateCategoryController);

router.delete("/deleteCategory/:id", authMiddleware, deleteCategoryController);



module.exports = router;