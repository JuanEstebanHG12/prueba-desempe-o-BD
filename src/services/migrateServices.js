import { insertDataFromCSV, queryTables } from "../utils/migrate.js";

async function createTables() {
    try {
        await queryTables()
    } catch (error) {
        console.error(error);
    }
}

async function migrateDataFromCSV() {
    try {
        return await insertDataFromCSV()
    } catch (error) {
        console.error(error);
    }
}

export { createTables, migrateDataFromCSV }