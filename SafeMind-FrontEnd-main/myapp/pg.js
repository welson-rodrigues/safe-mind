const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
	host: "dpg-crlfmge8ii6s73dadpng-a.oregon-postgres.render.com",
	user: "aohslz",
	password: "hpbABMfRsI9yeGpZHFXUV8ojw2HH4nVP",
	database: "bancodobancodedados",
	port: "5432",
	ssl: {
		rejectUnauthorized: false,
	},
});

async function listarProfissionais() {
	try {
		const result = await pool.query("SELECT * FROM profissionais");
		return result.rows;
	} catch (error) {
		throw error;
	}
}

async function searchProfissional(id) {
	try {
		const result = await pool.query(
			`SELECT * FROM profissionais WHERE id=${id}`
		);
		return result.rows;
	} catch (error) {
		throw error;
	}
}

async function cadastrarProfissional(
	nome,
	email,
	senha,
	descricao,
	funcao,
	especialidade,
	relacionamento_com_pacientes
) {
	try {
		await pool.query(
			"INSERT INTO profissionais (nome, email, senha, descricao, funcao, especialidade, relacionamento_com_pacientes) VALUES ($1, $2, $3, $4, $5, $6, $7)",
			[
				nome,
				email,
				senha,
				descricao,
				funcao,
				especialidade,
				relacionamento_com_pacientes,
			]
		);
	} catch (error) {
		throw error;
	}
}

async function cadastrarHorario(
	profissional_id,
	descricao,
	data_evento,
	hora_inicio,
	hora_fim
) {
	try {
		await pool.query(
			"INSERT INTO profissional_agendas (profissional_id, descricao, data_evento, hora_inicio, hora_fim) VALUES ($1, $2, $3, $4, $5)",
			[profissional_id, descricao, data_evento, hora_inicio, hora_fim]
		);
	} catch (error) {
		throw error;
	}
}

async function listarAgenda(profissional_id) {
	try {
		const result = await pool.query(
			`SELECT * FROM profissional_agendas WHERE profissional_id = ${profissional_id}`
		);
		return result.rows;
	} catch (error) {
		throw error;
	}
}

async function cadastrarPaciente(
	nome,
	email,
	senha,
	descricao,
	maior_problema,
	hobbies,
	vicios
) {
	try {
		const result = await pool.query(
			"INSERT INTO pacientes (nome, email, senha, descricao, maior_problema, hobbies, vicios) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
			[nome, email, senha, descricao, maior_problema, hobbies, vicios]
		);
		return result.rows[0].id; // Retorna o ID do paciente recém-cadastrado
	} catch (error) {
		throw error;
	}
}

async function listarPacientes() {
	try {
		const result = await pool.query("SELECT * FROM pacientes");
		return result.rows;
	} catch (error) {
		throw error;
	}
}

async function agendarConsulta(paciente_id, profissional_agenda_id) {
	try {
		await pool.query(
			"INSERT INTO consultas (paciente_id, profissional_agenda_id) VALUES ($1, $2)",
			[paciente_id, profissional_agenda_id]
		);
	} catch (error) {
		throw error;
	}
}

module.exports = {
	pool,
	listarProfissionais,
	cadastrarProfissional,
	cadastrarHorario,
	listarAgenda,
	cadastrarPaciente,
	listarPacientes,
	agendarConsulta,
	searchProfissional,
};
