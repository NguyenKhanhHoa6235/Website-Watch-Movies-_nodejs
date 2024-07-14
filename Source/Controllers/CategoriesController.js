import asyncHandler from 'express-async-handler'
import Categories from "../Models/CategoriesModel.js"

//********** PUBLIC CONTROLLER **********

//get all categories
//route GET /api/categories
//access public
const getCategories = asyncHandler(async(req, res)=>{
    try{
        //find all categories in db
        const categories = await Categories.find({});
        //send all categories to the client
        res.json(categories);
    }catch(error){
        res.status(400).json({message: error.message});
    }
});


//********** ADMIN CONTROLLER **********

//create new category
//route POST /api/categories
//access private/admin
const createCategory = asyncHandler(async(req, res)=>{
    try{
        //get title from request body
        const {title} = req.body;
        //create new cateroy
        const category = new Categories({
            title,
        });
        //save the category in db
        const createCategory = await category.save();
        //send new category to the client
        res.status(201).json(createCategory);
    }catch(error){
        res.status(400).json({message: error.message});
    }
});


//update new category
//route PUT /api/categories/:id
//access private/admin
const updateCategory = asyncHandler(async(req, res)=>{
    try{
        //get category id from request params
        const category = await Categories.findById(req.params.id);

        if(category){
            //update category title
            category.title = req.body.title || category.title;
            //savae the updated category in db
            const updatedCategory = await category.save();
            //send the updated category to the client
            res.json(updatedCategory);
        }
        else{
            res.status(404).json({message: "Category not found"});
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
});


//delete category
//route DELETE /api/categories/:id
//access private/admin
const deleteCategory = asyncHandler(async(req, res)=>{
    try{
        //get category id from request params
        const category = await Categories.findById(req.params.id);

        if(category){
            //delete the category from db
            await category.deleteOne();
            //send success message to the client
            res.json({message: "Category removed"});
        }
        else{
            res.status(404).json({message: "Category not found"});
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

export {getCategories, createCategory, updateCategory, deleteCategory};