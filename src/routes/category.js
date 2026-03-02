import { Router } from "express";
import { createCategory, getCategories, updateCategories } from "../services/categoryServices.js";

const router = Router()

router.get('/', async (req, res) =>{
    try {
        const response = await getCategories()
        res.status(200).json({succes:true, response })
    } catch (error) {
        res.status(500).json({succes:false, message: "Error to load categories" })
    }
})

router.post('/create-category', async (req, res) =>{
    try {
        await (req.body)
        res.status(200).json({message : `Category ${req.body.category_name} created`})
    } catch (error) {
        res.status(500).json({succes:false, message: "Error the category was not created" })
    }
})



router.put('/update-category/:id', async (req, res) =>{
    try {
        await updateCategories(req.body,req.params.id)
        res.status(200).json({message : `Category name updated to ${req.body.category_name}`})
    } catch (error) {
        res.status(500).json({succes:false, message: "Error to update the category" })
    }
})



export default router