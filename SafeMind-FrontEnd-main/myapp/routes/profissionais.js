var express = require("express");
var router = express.Router();
var {
	pool,
	listarProfissionais,
	cadastrarProfissional,
	cadastrarHorario,
	listarAgenda,
	searchProfissional,
} = require("../pg");

router.get("/", async (req, res) => {
	let idPro = req.params.id;

	try {
		listarProfissionais().then((profissionais) => {
			const profissionaisFiltrados = profissionais.map((profissional) => ({
				nome: profissional.nome,
				descricao: profissional.descricao,
				id: profissional.id,
				
			}));
			res.render("profissionalsPage", {
				profissionais: profissionaisFiltrados,
			});
		});
	} catch {
		res.status(500).send("Erro ao consultar profissionais");
	}
});

router.get("/:id", async (req, res) => {
	let idPro = req.params.id;

	try {
		searchProfissional(idPro).then((profissional) => {
			const profissionalPerfil = profissional[0];
			console.log(profissionalPerfil);
			/*
            res.render('perfilProfissional', {
                userId: profissionalPerfil.userId,
                userName: profissionalPerfil.userName,
                userDesc: profissionalPerfil.userDesc,
                userFunc: profissionalPerfil.userFunc,
                userEspc: profissionalPerfil.userEspc,
                userRela: profissionalPerfil.userRela,
                userType: "paciente"
            } );  ]*/
			res.render("perfilProfissional", {
				userId: profissionalPerfil.id,
				userName: profissionalPerfil.nome,
				userEmail: profissionalPerfil.email,
				userDesc: profissionalPerfil.descricao,
				userFunc: profissionalPerfil.funcao,
				userEspc: profissionalPerfil.especialidade,
				userRela: profissionalPerfil.relacionamento_com_pacientes,
				userType: "paciente",
			});
		});
	} catch {
		res.status(500).send("Erro ao consultar profissionais");
	}
});

router.post("/", async (req, res) => {
	const {
		nome,
		email,
		senha,
		descricao,
		funcao,
		especialidade,
		relacionamento_com_pacientes,
	} = req.body;
	try {
		cadastrarProfissional(
			nome,
			email,
			senha,
			descricao,
			funcao,
			especialidade,
			relacionamento_com_pacientes
		).then(() => {
			res.status(201).send("Profissional criado");
		});
	} catch {
		res.status(500).send("Erro ao criar profissional");
	}
});

router.get("/agendamento", async (req, res) => {
	const { profissional_id } = req.body;
	try {
		//const result = await pool.query(`SELECT * FROM profissional_agendas WHERE profissional_id = ${profissional_id}`);
		listarAgenda(profissional_id).then((agenda) => {
			res.json(agenda);
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Erro ao consultar agendas de profissionais");
	}
});

router.post("/agendamento", async (req, res) => {
	const { profissional_id, descricao, data_evento, hora_inicio, hora_fim } =
		req.body;
	try {
		cadastrarHorario(
			profissional_id,
			descricao,
			data_evento,
			hora_inicio,
			hora_fim
		).then(() => {
			res.status(201).send("Agenda de profissional criada");
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Erro ao criar agenda de profissional");
	}
});

module.exports = router;