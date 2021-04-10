# Clug Backend

## Requirments
- Node v12 or greater
- A Postgres database

## Installation
```bash
# First install dependencies
npm ci

# Then set up your environment
cp .env.example .env
nano .env

# Lastly, you can run project in dev mode
npm run watch-debug
```

## Avaiable documented npm scripts
- ``npm run build`` Create a build for the project
- ``npm run serve`` Will serve the project from the build
- ``npm run test`` Will run test from the build
- ``npm run watch-debug`` Serve and watch the project
- ``npm run watch-test`` Run test and watch for change
- ``npm run migration:run`` Run the migration for the db
- ``npm run migration:rollback`` Rollback last executed migration
- ``npm run clug`` Execute a custom clug script (see next section)

## Avaible custom clug script
- ``npm run clug -- create-user [ARGS]`` Create a new user in the database

## Docker thing
docker-compose down --rmi local -V //Delete all containers
docker-compose up -d //Run docker containers

## libs used

### database
* [typeorm](https://typeorm.io/)

### testing
* [Supertest](https://www.npmjs.com/package/supertest)
* [Jest](jest)

### utils
* [Winston](https://www.npmjs.com/package/winston)
* [express-validator](https://express-validator.github.io/)

### JWT
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [express-jwt](https://www.npmjs.com/package/express-jwt)
* [express-jwt-permissions](https://github.com/MichielDeMey/express-jwt-permissions)