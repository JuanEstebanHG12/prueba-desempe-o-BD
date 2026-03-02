#Database-Performance-Test MegaStore Global

MegaStore Global is facing an operational crisis. For years, they have managed all their inventory, sales, suppliers, and customers in a single Excel master file. The volume of data has grown so much that the file is unmanageable: there are price inconsistencies, duplicate customer addresses with spelling errors, and it's impossible to know the actual stock levels in real time.

PostgreSQL database solution for relational databases to address data redundancy
Along with a non-relational database (MongoDB) for audit log management

PRE-REQUIREMENTS:
-- Have Node.js with npm installed
- Run `npm install`
- Add an .env file with the following configuration:
```
PORT=3000
POSTGRES_URI="postgresql://<USERNAME>:<PASSWORD>@localhost:<PORT>/<DATABASE_NAME>"
MONGO_URI="mongodb://localhost:<PORT>/<DATABASE_NAME>"
FILE_DATA_CSV=<CSSV_DATA_PATH>
```
Replacing:
- `<USERNAME>` -> with your PostgreSQL username
- `<PASSWORD>` -> with your MongoDB password Postgres
- `<PORT>` -> Your server port
- `<DB_NAME>` -> The database name
- `<PATH_TO_CSV_DATA>` -> The path to the .CSV file

- Verify that the `db_megastore_exam` database exists before running the program, so that the tables are created correctly.

> Run `npm run dev` to start the server.

# Using the endpoints
To use the endpoints and start consuming the data, we need Cartero.
Once in Cartero, we can create new requests to use the following endpoints:

### Migrate endpoint
- POST -> http://localhost:3000/api/mega-store/migrate -> Endpoint to migrate data from a CSV file

### Products endpoints
- GET -> http://localhost:3000/api/mega-store/products/most-selling -> Indicates that it lists the best-selling products

### Categories endpoints
- GET -> http://localhost:3000/api/mega-store/categories/ -> Get all categories
- POST -> http://localhost:3000/api/mega-store/categories/create-category -> Create a new category
- PUT -> http://localhost:3000/api/mega-store/categories/update-category/1 -> Update an existing category

> The Postman collection, used to run the endpoints, is located in this repository in the docs folder.

# Author
> Juan Esteban Holguin Galeano