const { Config } = require('@foal/core');

module.exports = {
  type: "postgres",
  host:Config.get('database.host',"localhost"),
  port:Config.get('database.port',"5432"),
  username:Config.get('database.username',"postgres"),
  password:Config.get('database.password',"1234"),
  database:Config.get('database.name',"foaltstest"),
  dropSchema: Config.get('database.dropschema', true),
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
  synchronize: Config.get('database.synchronize', true)
}
