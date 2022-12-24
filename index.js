const express = require('express')
const app = express()
const connection = require("./database/database")
const categoryController = require("./categories/categoryController")
const articleController = require("./articles/articleController")
const userController = require("./user/userController")
const bodyParser = require("body-parser")
const session = require("express-session");

//View engine
app.set('view engine', 'ejs')

//Database
connection.authenticate()
    .then(() => console.log("conexão feita com o banco de dados"))
    .catch(error => console.log(error));

const Article = require("./articles/Article")
const Category = require("./categories/Category");
const User = require("./user/User")
const { render } = require("ejs");

//Express Use
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())

//Sessions
app.use(session({
    secret: "sdniasodjnisandiasndipmiosdm103329423dss",
    cookie: {maxAge: 10000000}
}))

//routes use 
app.use("/", categoryController)
app.use("/", articleController)
app.use("/", userController)

//routes
app.get("/", (req, res) => {
    Article.findAll({
        limit: 5,
        order: [["id", "DESC"]]
    }).then(articles => {
        res.render("pages/index", {articles: articles})
    })
})

app.get("/ler/artigo/:id", (req, res) => {
    let id = req.params.id

    if (id != undefined) {

        if (!isNaN(id)) {

            Article.findOne({
                where: {id: id}
            }).then(article => {

                if (article == undefined) {
                    res.redirect("/")
                } else {
                        res.render("pages/article", {article: article})
                }
            }).catch(error => {
                res.redirect("/")
            })

        } else {
            res.redirect("/")
        }

    }else {
        res.redirect("/")
    }
})

app.listen(3000, () => {
    console.log("rodando")
})