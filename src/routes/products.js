import { Router } from "express";
import { getProductMostSelling } from "../services/productsServices.js";


const router = Router()

router.get('/most-selling', async (req,res) =>{
    try {
        const response = await getProductMostSelling()
        res.status(200).json({
            response : "ok",
            data : response.rows
        })
    } catch (error) {
        
    }
})

export default router;