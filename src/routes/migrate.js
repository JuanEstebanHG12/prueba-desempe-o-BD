import { Router } from "express";
import { migrateDataFromCSV } from "../services/migrateServices.js";

const router = Router()

router.post('/migrate', async (req,res) =>{
    try {
        const response = await migrateDataFromCSV()
        res.status(200).json({
            messagge : "Migrate data successfully",
            dataMigrated : response
        })
    } catch (error) {
        
    }
})

export default router;