const express = require('express');
const router = express.Router();
const Category = require("../categories/Category")
const Article = require("./Article")
const User = require('../user/User');
const Slugify = require("slugify")

//middleware
const adminAuth = require("../middleware/adminAuth");

router.get("/usuario/artigos", adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}],
        order: [["id", "DESC"]]
    }).then(articles => {
        res.render("pages/user/article/index", {articles: articles})
    })
})

router.get("/usuario/artigo/:id", (req, res) => {
    let id = req.params.id

    if (id != undefined) {

        if (!isNaN(id)) {

            Article.findOne({
                where: {id: id}
            }).then(article => {

                if (article == undefined) {
                    res.redirect("/")
                } else {
                        res.render("pages/user/article/ler", {article: article})
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

router.get("/usuario/MeusArtigos", adminAuth, (req, res) => {
    let user = req.session.user

    Article.findAll({
        include: [{model: Category}],
    }).then(articles => {
        res.render("pages/user/article/MyArticles", {articles: articles, user: user})
    })
})

router.get("/usuario/artigo/new/criar", adminAuth , (req, res) => {
    let user = req.session.user.email

    User.findOne({
        where: {email: user}
    }).then(usar => {
        Category.findAll().then(categories => {
            res.render("pages/user/article/create", {categories: categories, use: usar})
        })
    })
})

router.post("/usuario/artigo/save", adminAuth, (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category
    let userId = req.body.userId

    Article.create({
        title: title,
        slug: Slugify(title),
        body: body,
        categoryId: category,
        userId: userId

        }).then(() => {
            res.redirect("/usuario/artigos")
        }).catch(error => {
            res.redirect("/usuario/artigos")
        })
}) 

router.get("/usuario/artigo/editar/:id", adminAuth, (req, res) => {
    let id = req.params.id

    if (id != undefined) {
        if (!isNaN(id)) {
            Article.findOne({
                where: {id: id},
            }).then(article => {
                if (article != undefined) {
                  Category.findAll().then(categories => {
                    res.render("pages/user/article/edit", {article: article, categories: categories})
                  })
                } else {
                    res.redirect("/usuario/artigos")
                }
            })
        } else {
            res.redirect("/usuario/artigos")
        }
    } else {
        res.redirect("/usuario/artigos")
    }
})



router.post("/artigo/atualizar", adminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.categoryId

    Article.update({
        title: title,
        slug: Slugify(title),
        body: body,
        categoryId: category
    }, {
        where: {id: id}
    }).then(() => {
        res.redirect("/usuario/artigos")
    }).catch(error => res.redirect("/usuario/artigos"))
}) 

router.post("/artigo/delete", adminAuth, (req, res) => {
    let id = req.body.id

    if (id != undefined) {
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/usuario/artigos")
        })
    } else {
        res.redirect("/usuario/artigos")
    }
})

router.get("/artigos/page/:num", (req, res) => {
    let page = req.params.num
    let offset = 0;

    if (isNaN(page) || page == 1) {
        offset = 5;
    } else {
        offset = (parseInt(page) - 1) * 5
    }

    Article.findAndCountAll({
        order: [["id", "DESC"]],
        limit: 5,
        offset: offset
    }).then(articles => {
        let next;
        
        if (offset + 5 >= articles.count) {
            next = false
        } else {
            next = true
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
            
        res.render("pages/user/article/page", {result: result})
    })
})


module.exports = router;