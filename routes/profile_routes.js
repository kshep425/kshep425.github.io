var db = require("../models");
module.exports = function (app) {

    app.get("/", function (req, res) {
        console.log("Open Homepage");
        res.render("index")
    })
}