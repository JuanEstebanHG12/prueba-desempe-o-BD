import { queryTables } from "../utils/migrate.js";

async function createTables() {
    try {
        await queryTables()
    } catch (error) {
        console.error(error);
    }
}

export { createTables }