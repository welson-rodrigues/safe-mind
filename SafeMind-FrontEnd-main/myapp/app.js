var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var { pool } = require("./pg");
var mongodb = require('./mongodb'); 

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var profissionaisRouter = require("./routes/profissionais");
var pacientesRouter = require("./routes/pacientes");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongodb.connectToMongo();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/profissionais", profissionaisRouter);
app.use("/pacientes", pacientesRouter);
app.use("/setembro", usersRouter);
app.use("/meeting", usersRouter);
app.use("/singup", usersRouter);
app.use("/perfilPacient", usersRouter);

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", async (req, res) => {
	const { email, password, type_user } = req.body;

	try {
		let userTable = "";
		if (type_user === "paciente") {
			userTable = "pacientes";
		} else if (type_user === "profissional") {
			userTable = "profissionais";
		} else {
			return res.status(400).send("Tipo de usuário inválido.");
		}

		const query = `SELECT * FROM ${userTable} WHERE email = $1`;
		const result = await pool.query(query, [email]);

		if (result.rows.length === 0) {
			return res.status(404).send("Usuário não encontrado.");
		}

		const user = result.rows[0];

		const validPassword = password == user.senha;
		if (!validPassword) {
			return res.status(401).send("Senha incorreta.");
		}
		if (type_user == "paciente") {
			return res.render("perfilPacient", {
				userId: user.id,
				userName: user.nome,
				userDesc: user.descricao,
				userProb: user.maior_problema,
				userVicio: user.vicios,
				userHobbies: user.hobbies,
				userType: "paciente",
			}); // Redireciona para o dashboard após o login
		} else {
			return res.render("perfilProfissional", {
				userId: user.id,
				userName: user.nome,
				userEmail: user.email,
				userDesc: user.descricao,
				userFunc: user.funcao,
				userEspc: user.especialidade,
				userRela: user.relacionamento_com_pacientes,
				userType: "profissional",
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Erro ao tentar fazer login.");
	}
});

app.get("/singup", (req, res) => {
	try {
		res.render("singup");
	} catch (error) {
		throw error;
	}
});
app.post("/singup", (req, res) => {
	const { name, email, password, type_user } = req.body;

	if (type_user == "paciente") {
		res.render("pacient", {
			nome: name,
			email: email,
			password: password,
			type_user: type_user,
		});
	} else {
		res.render("profissional", {
			nome: name,
			email: email,
			password: password,
			type_user: type_user,
		});
	}
});

app.get("/adicionar_agenda", (req, res) => {
	res.render("meeting");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (error, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = error.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(error.status || 500);
	res.render("error");
});

module.exports = app;
