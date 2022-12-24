const Sequelize = require('sequelize');
const connection = require("../database/database")
const Category = require("../categories/Category")
const User = require("../user/User")
const { BelongsTo } = require('sequelize');

const Article = connection.define("articles", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

//Articles and categories
Article.belongsTo(Category)
Category.hasMany(Article)

//User e Article
User.hasMany(Article)

Article.sync({force: false})

module.exports = Article;