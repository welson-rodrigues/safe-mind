let express = require("express");
let router = express.Router();
let {
	pool,
	cadastrarPaciente,
	listarPacientes,
	agendarConsulta,
} = require("../pg");
let { logUserAction } = require("../mongodb");

router.post("/", async (req, res) => {
	const { nome, email, senha, descricao, maior_problema, hobbies, vicios } =
		req.body;

	try {
		// Captura o IP do cliente (opcional)
		const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

		// Cadastra o paciente no PostgreSQL e obtém o ID
		const pacienteId = await cadastrarPaciente(
			nome,
			email,
			senha,
			descricao,
			maior_problema,
			hobbies,
			vicios
		);

		// Registra o log no MongoDB com o ID do paciente, nome, email e ip
		await logUserAction(pacienteId, nome, email, ip);

		// Envia uma resposta de sucesso
		res.render("perfilPacient", {
			userId: nome,
			userName: nome,
			userDesc: descricao,
			userProb: maior_problema,
			userVicio: vicios,
			userHobbies: hobbies,
			userType: "paciente",
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Erro ao criar paciente");
	}
});

module.exports = router;
