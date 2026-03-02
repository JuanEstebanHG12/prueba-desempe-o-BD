import express from "express";

import migrateRouter from "./routes/migrate.js"
import productsRouter from "./routes/products.js"

export const app = express()

app.use(express.json())

app.use('/api/mega-store', migrateRouter)
app.use('/api/mega-store/products', productsRouter)

