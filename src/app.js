import express from "express";

import migrateRouter from "./routes/migrate.js"
import productsRouter from "./routes/products.js"
import categoriesRouter from "./routes/category.js"

export const app = express()

app.use(express.json())

app.use('/api/mega-store', migrateRouter)
app.use('/api/mega-store/products', productsRouter)
app.use('/api/mega-store/categories', categoriesRouter)

