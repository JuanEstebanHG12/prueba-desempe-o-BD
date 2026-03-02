import { pool } from "../config/postgres.js"
import fs from 'fs';
import csv from 'csv-parser';
import { env } from "../config/env.js";

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
	"quantity" DECIMAL(10,1) NOT NULL,
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
	"id_transaction" VARCHAR(20) NOT NULL UNIQUE,
	"sku_product" VARCHAR(25) NOT NULL,
    CONSTRAINT fk_transaction_product_id_transaction_transaction FOREIGN KEY ("id_transaction")
        REFERENCES "transaction"("id")
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT fk_transaction_product_sku_product_product FOREIGN KEY ("sku_product")
        REFERENCES "product"("sku")
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



export { queryTables }