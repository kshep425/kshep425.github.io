// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Creating express app
var app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// =============================================================
//const api_routes = require("./routes/api_routes")
//app.use(api_routes);
require("./routes/profile_routes")(app)

// Syncing our sequelize models and then starting our Express app
// ==============================================================
db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});

module.exports = app;