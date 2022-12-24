const express = require('express');
const router = express.Router();
const User = require("./User")
const Article = require("../articles/Article")
const Slugify = require("slugify")
const bcrypt = require('bcrypt');

//middleware
const adminAuth = require("../middleware/adminAuth")

router.get("/cadastro", (req, res) => {
    res.render("pages/user/register")
})

router.post("/cadastro/salvar", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password, salt)

    User.create({
        email: email,
        password: hash
    }).then(() => {
        res.redirect("/")
    })
})

router.get("/login", (req, res) => {
    res.render("pages/user/login")
})

router.post("/login/logar", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where: {email: email}
    }).then(async user => {
        if (user != undefined) {
            if (await bcrypt.compare(password, user.password)) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/usuario/artigos")    
            } else {
                res.redirect("/login")
            }
        } else {
            res.redirect("/login")
        }
    })
})

router.get("/usuario/logoaut", adminAuth, (req, res) => {
    req.session.user = undefined
    res.redirect("/login")
})

module.exports = router;
