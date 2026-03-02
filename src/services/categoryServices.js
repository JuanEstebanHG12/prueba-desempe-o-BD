import { pool } from "../config/postgres.js";

async function createCategory(data) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query(`
                INSERT INTO "category" ("name") VALUES ($1) ON CONFLICT ("name")
                DO UPDATE SET 
                    name = EXCLUDED.name
                returning xmax, id
                `, [data.category_name])

        await client.query('COMMIT')

    } catch (error) {
        await client.query('ROLLBACK')
    } finally {
        client.release()
    }
}

async function getCategories() {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const response = await client.query(`SELECT * FROM category `)

        await client.query('COMMIT')
        return response.rows
    } catch (error) {
        await client.query('ROLLBACK')
    } finally {
        client.release()
    }
}

async function updateCategories(data, id) {
    
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query('update category c set name = COALESCE($1,name) where c.id = $2', [data.category_name, id])
        await client.query('COMMIT')

        await client.query('COMMIT')

    } catch (error) {
        await client.query('ROLLBACK')
    } finally {
        client.release()
    }
}


export {
    createCategory,
    getCategories,
    updateCategories
}