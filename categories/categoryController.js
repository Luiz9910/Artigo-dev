const express = require('express');
const router = express.Router();
const Category = require("./Category")
const Slugify = require("slugify")

//middleware
const adminAuth = require("../middleware/adminAuth")

router.get("/usuario/categoria/criar", adminAuth, (req, res) => {
    res.render("pages/user/category/create")
})

router.post("/usuario/categoria/salvar", adminAuth,  (req, res) => {
    let title = req.body.title

    if (title != undefined) {
         Category.create({
            title: title,
            slug: Slugify(title)
         }).then(() => res.redirect("/usuario/categoria"))
    } else {
        res.redirect("/usuario/categoria/criar")
    }
})

router.get("/usuario/categoria", adminAuth, (req, res) => {
    Category.findAll({raw: true}).then(categories => {
        res.render("pages/user/category/index", {categories: categories})
    })
})

router.get("/usuario/categoria/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id

    if (!isNaN(id)) {
        Category.findByPk(id).then(category => {
            if (category != undefined) {
                res.render("pages/user/category/edit", {category: category})
            } else {
                res.redirect("/usuario/categoria")
            }
        }).catch(error => {
            res.redirect("/usuario/categoria")
        })
    } else {
        res.redirect("/usuario/categoria")
    }
})

router.post("/usuario/categoria/editar", adminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title

    Category.update({title: title, slug: Slugify(title)}, {
        where: {id: id}
    }).then(() => {
        res.redirect("/usuario/categoria")
    }).catch(error => {
        res.redirect("/usuario/categoria")
    })
})

router.post("/usuario/categoria/deletar", (req, res) => {
    let id = req.body.id

    Category.destroy({
        where: {id: id},
    }).then(() => res.redirect("/usuario/categoria"))
})

module.exports = router;