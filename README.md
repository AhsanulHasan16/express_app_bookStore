# express_app_bookStore

After cloning the repo just go to the project directory and run: 
npm install
This should install all the dependencies and the libraries needed to get the application running.
Create a .env file at the root folder as follows:
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=bookstore
PORT=3000

Make sure that you have a database named bookstore in your localhost running and give your database user username and password at DB_USER and DB_PASSWORD.

After giving the database credentials run the following command:

npx knex migrate:latest

If your credentials are correct and you have a database with the name given in the .env this should initialize the database with the schemas and everything.

Lastly, run the following command:
npm start

And the application will run on the port given in the .env file.

See the routes folder for the routes you need to go to so that you can test the APIs.


# Technologies Used 

Node.js
Express.js
Knex.js
MySQL
Joi for validation
JWT for authentication and authorization
