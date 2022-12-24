const Sequelize = require('sequelize');

const connection = new Sequelize("guiaexpress", "root", "Luiz1992@", {
    host: "localhost",
    dialect: "mysql",
})

module.exports = connection;