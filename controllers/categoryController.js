const categoryModel = require("../models/categoryModel");

const createCategoryController = async (req, res) => {

    try {
        const category = await categoryModel.create({
            ...req.body
        }); 
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category not created"
            });
        }
        await category.save();
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getAllCategoriesController = async (req, res) => {

    try {
        const categories = await categoryModel.find();
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


const updateCategoryController = async (req, res) => {

    try {
        const { title, image } = req.body;

        const category = await categoryModel.findByIdAndUpdate(
            req.params.id,
            { title, image },
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};  

const deleteCategoryController = async (req, res) => {

    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        await categoryModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
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
    createCategoryController,
    getAllCategoriesController,
    updateCategoryController,
    deleteCategoryController
};