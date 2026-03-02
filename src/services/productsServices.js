import { pool } from "../config/postgres.js";


async function getProductMostSelling() {
    const client = await pool.connect()
    try {
        return await client.query(`select p."name" ,count(tp.sku_product ), sum(t.total_line_value ) as income from category c 
join product p on p.category_id  = c.id
join transaction_product tp on tp.sku_product = p.sku
join "transaction" t on tp.id_transaction = t.id
group by p."name"
order by income desc `)
    } catch (error) {

    }
}

export { getProductMostSelling }