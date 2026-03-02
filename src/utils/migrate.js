import { pool } from "../config/postgres.js"
import fs from 'fs';
import csv from 'csv-parser';
import { env } from "../config/env.js";
import { AuditLogs } from "../models/auditLogs.js";

async function queryTables() {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        //create table category
        await client.query(`
            
CREATE TABLE IF NOT EXISTS "category" (
	"id" SERIAL NOT NULL UNIQUE,
	"name" VARCHAR(30) NOT NULL UNIQUE,
	PRIMARY KEY("id")
);
            `)
        //create table customer
        await client.query(`
            CREATE TABLE IF NOT EXISTS "customer" (
	"id" SERIAL NOT NULL UNIQUE,
	"name" VARCHAR(50) NOT NULL,
	"email" VARCHAR(50) NOT NULL UNIQUE,
	"address" VARCHAR(50) NOT NULL,
	"phone" VARCHAR(15) NOT NULL,
	PRIMARY KEY("id")
);

            `)

        //create table suplier
        await client.query(`
CREATE TABLE IF NOT EXISTS "suplier" (
	"id" SERIAL NOT NULL UNIQUE,
	"name" VARCHAR(50) NOT NULL UNIQUE,
	"email" VARCHAR(50) NOT NULL UNIQUE,
	PRIMARY KEY("id")
);
            `)

        //create table transaction
        await client.query(`
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" VARCHAR(20) NOT NULL UNIQUE,
	"date" DATE NOT NULL,
	"quantity" INTEGER NOT NULL,
	"total_line_value" DECIMAL(10,1) NOT NULL,
	"customer_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
    CONSTRAINT fk_transaccion_customer_id_customer FOREIGN KEY ("customer_id")
        REFERENCES "customer"("id")
        ON UPDATE NO ACTION ON DELETE NO ACTION
);
            `)

        //create table product
        await client.query(`
            CREATE TABLE IF NOT EXISTS "product" (
	"sku" VARCHAR(25) NOT NULL UNIQUE,
	"category_id" INTEGER NOT NULL,
	"name" VARCHAR(100) NOT NULL UNIQUE,
	"unit_price" DECIMAL(10,1) NOT NULL,
	PRIMARY KEY("sku"),
    CONSTRAINT fk_product_category_id_category FOREIGN KEY ("category_id")
        REFERENCES "category"("id")
        ON UPDATE NO ACTION ON DELETE NO ACTION
);
            `)

        //create table transaction_product
        await client.query(`
            CREATE TABLE IF NOT EXISTS "transaction_product" (
	"id_transaction" VARCHAR(20) NOT NULL,
	"sku_product" VARCHAR(25) NOT NULL,
    CONSTRAINT fk_transaction_product_id_transaction_transaction FOREIGN KEY ("id_transaction")
        REFERENCES "transaction"("id")
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT fk_transaction_product_sku_product_product FOREIGN KEY ("sku_product")
        REFERENCES "product"("sku")
        ON UPDATE NO ACTION ON DELETE NO ACTION
);
            `)


        //create table product_suplier
        await client.query(`
            CREATE TABLE IF NOT EXISTS "product_suplier" (
	"sku_product" VARCHAR(25) NOT NULL,
	"id_suplier" INTEGER NOT NULL,
    CONSTRAINT fk_product_suplier_sku_product_product FOREIGN KEY ("sku_product")
        REFERENCES "product"("sku")
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT fk_product_suplier_id_suplier_suplier FOREIGN KEY ("id_suplier")
        REFERENCES "suplier"("id")
        ON UPDATE NO ACTION ON DELETE NO ACTION
);
            `)


        await client.query('COMMIT')



    } catch (error) {
        await client.query('ROLLBACK')
    } finally {
        client.release()
    }
}

async function insertDataFromCSV() {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const result = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(env.fileDataCsv)
                .pipe(csv())
                .on("data", (data) => result.push(data))
                .on("end", resolve)
                .on("error", reject);
        });
        const counters = {
            contCategories: 0,
            contCustomers: 0,
            contTransactions: 0,
            contProducts: 0,
            contSupliers: 0
        }
        let lengthTransactionProductExist = 0
        let lengthProductSuplierExist = 0
        for (const row of result) {

/* ==============================================CATEGORIES========================== */
            const category_result = await client.query(`
                INSERT INTO "category" ("name") VALUES ($1) ON CONFLICT ("name")
                DO UPDATE SET 
                    name = EXCLUDED.name
                returning xmax, id
                `, [row.product_category])


                const category_mongo = {
                query: `INSERT INTO "category" ("name") VALUES ($1) ON CONFLICT ("name")
                            DO UPDATE SET 
                                name = EXCLUDED.name
                            returning xmax, id`,
                date: Date.now(),
                operation: category_result.command
            }
            await AuditLogs.findOneAndUpdate(
                { "table": "category" },
                {
                    $setOnInsert: {
                        "table": "category",
                    },
                    $push: {
                        "history": category_mongo
                    }


                },
                { upsert: true }
            )
/* =======================================CUSTOMERS========================================= */
            const customer_result = await client.query(`
                INSERT INTO "customer" ("name","email","address","phone") VALUES ($1,$2,$3,$4) ON CONFLICT ("email")
                DO UPDATE SET 
                    email = EXCLUDED.email
                returning xmax, id
                `, [row.customer_name, row.customer_email, row.customer_address, row.customer_phone])


                const customer_mongo = {
                query: `INSERT INTO "customer" ("name","email","address","phone") VALUES ($1,$2,$3,$4) ON CONFLICT ("email")
                DO UPDATE SET 
                    email = EXCLUDED.email
                returning xmax, id`,
                date: Date.now(),
                operation: customer_result.command
            }
            await AuditLogs.findOneAndUpdate(
                { "table": "customer" },
                {
                    $setOnInsert: {
                        "table": "customer",
                    },
                    $push: {
                        "history": customer_mongo
                    }


                },
                { upsert: true }
            )


/* =========================================SUPLIER====================================== */

            const suplier_result = await client.query(`
                INSERT INTO "suplier" ("name","email") VALUES ($1,$2) ON CONFLICT ("email")
                DO UPDATE SET 
                    email = EXCLUDED.email
                returning xmax,id
                `, [row.supplier_name, row.supplier_email])

                   const suplier_mongo = {
                query: `INSERT INTO "suplier" ("name","email") VALUES ($1,$2) ON CONFLICT ("email")
                DO UPDATE SET 
                    email = EXCLUDED.email
                returning xmax,id`,
                date: Date.now(),
                operation: suplier_result.command
            }
            await AuditLogs.findOneAndUpdate(
                { "table": "suplier" },
                {
                    $setOnInsert: {
                        "table": "suplier",
                    },
                    $push: {
                        "history": suplier_mongo
                    }


                },
                { upsert: true }
            )
            
/* ========================================TRANSACTION=========================== */
            const transaction_result = await client.query(`
                INSERT INTO "transaction" ("id","date","quantity","total_line_value","customer_id") VALUES ($1,$2,$3,$4,$5) ON CONFLICT ("id")
                DO UPDATE SET 
                    id = EXCLUDED.id
                returning xmax,id
                `, [row.transaction_id, row.date, row.quantity, row.total_line_value, customer_result.rows[0].id])

                  const transaction_mongo = {
                query: `INSERT INTO "transaction" ("id","date","quantity","total_line_value","customer_id") VALUES ($1,$2,$3,$4,$5) ON CONFLICT ("id")
                DO UPDATE SET 
                    id = EXCLUDED.id
                returning xmax,id`,
                date: Date.now(),
                operation: transaction_result.command
            }
            await AuditLogs.findOneAndUpdate(
                { "table": "transaction" },
                {
                    $setOnInsert: {
                        "table": "transaction",
                    },
                    $push: {
                        "history": transaction_mongo
                    }


                },
                { upsert: true }
            )

/* =======================PRODUCTS========================== */
            const product_result = await client.query(`
                INSERT INTO "product" ("sku","category_id","name","unit_price") VALUES ($1,$2,$3,$4) ON CONFLICT ("sku")
                DO UPDATE SET 
                    sku = EXCLUDED.sku
                returning xmax, sku
                `, [row.product_sku, category_result.rows[0].id, row.product_name, row.unit_price])

                       const product_mongo = {
                query: `INSERT INTO "product" ("sku","category_id","name","unit_price") VALUES ($1,$2,$3,$4) ON CONFLICT ("sku")
                DO UPDATE SET 
                    sku = EXCLUDED.sku
                returning xmax, sku`,
                date: Date.now(),
                operation: product_result.command
            }
            await AuditLogs.findOneAndUpdate(
                { "table": "product" },
                {
                    $setOnInsert: {
                        "table": "product",
                    },
                    $push: {
                        "history": product_mongo
                    }


                },
                { upsert: true }
            )



            do {
                const transaction_productExist = await client.query("select * from transaction_product tp where tp.id_transaction = $1 and tp.sku_product = $2", [transaction_result.rows[0].id, product_result.rows[0].sku])
                lengthTransactionProductExist = transaction_productExist.rows.length
            } while (lengthTransactionProductExist < 0);
            if (lengthTransactionProductExist == 0) {
                await client.query(`
                 INSERT INTO "transaction_product" ("id_transaction","sku_product") VALUES ($1,$2)
                 `, [transaction_result.rows[0].id, product_result.rows[0].sku])
            }

            do {
                const product_suplierExist = await client.query("select * from product_suplier ps where ps.sku_product = $1 and ps.id_suplier = $2", [product_result.rows[0].sku, suplier_result.rows[0].id])
                lengthProductSuplierExist = product_suplierExist.rows.length
            } while (lengthProductSuplierExist < 0);
            if (lengthProductSuplierExist == 0) {
                await client.query(`
             INSERT INTO "product_suplier" ("sku_product","id_suplier") VALUES ($1,$2)
             `, [product_result.rows[0].sku, suplier_result.rows[0].id])
            }


            if (category_result.rows[0].xmax === '0') counters.contCategories++;
            if (customer_result.rows[0].xmax === '0') counters.contCustomers++;
            if (suplier_result.rows[0].xmax === '0') counters.contSupliers++;
            if (transaction_result.rows[0].xmax === '0') counters.contTransactions++;
            if (product_result.rows[0].xmax === '0') counters.contProducts++;


        }//end for


        await client.query('COMMIT')
        return counters
    } catch (error) {
        console.log(error);

        await client.query('ROLLBACK')
    } finally {
        client.release()
    }
}

export { queryTables, insertDataFromCSV }