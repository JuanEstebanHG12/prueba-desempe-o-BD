import { app } from "./app.js";
import { env } from "./config/env.js";

try {
    console.log('Conecting to PostgresSQL...');
    app.listen(env.port, () => {
        console.log(`server running on port ${env.port}`);
    })

} catch (error) {
    console.log(error);
    process.exit(1)
}