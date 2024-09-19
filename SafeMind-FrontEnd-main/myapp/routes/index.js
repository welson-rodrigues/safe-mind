var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
	res.render("login.ejs");
});

router.get("/home", (req, res) => {
	res.render("home.ejs");
});

router.get("/setembro", (req, res) => {
	res.render("setember.ejs");
});

router.get("/meeting", (req, res) => {
	res.render("meeting.ejs");
});

router.get("/perfilPacient", (req, res) => {
	res.render("perfilPacient.ejs");
});

router.get("/singup", (req, res) => {
	res.render("singup.ejs");
});


module.exports = router;
