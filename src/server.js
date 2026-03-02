import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectMongoDB } from "./config/mongoDB.js";
import { createTables } from "./services/migrateServices.js";

try {
    console.log('Conecting to MongoDB...');
    await connectMongoDB()
    console.log('Conecting to PostgresSQL...');
    await createTables()
    app.listen(env.port, () => {
        console.log(`server running on port ${env.port}`);
    })

} catch (error) {
    console.log(error);
    process.exit(1)
}