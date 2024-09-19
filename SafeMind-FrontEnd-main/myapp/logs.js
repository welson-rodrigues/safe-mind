const mongoose = require('mongoose');

// Definindo o esquema para os logs de cadastro
const logSchema = new mongoose.Schema({
  userId: String, // ID do paciente, o mesmo do PostgreSQL
  nome: String,   // Nome do paciente
  email: String,  // Email do paciente
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String,  
});

// Criando o modelo a partir do esquema
const Log = mongoose.model('Log', logSchema);

// Função para registrar o log de uma ação
async function logAction(userId, nome, email, ip) {
  try {
    const log = new Log({
      userId,  // ID do paciente
      nome,    // Nome do paciente
      email,   // Email do paciente
      ip      
    });
    await log.save();
    console.log('Log registrado no MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar o log no MongoDB:', error);
  }
}

module.exports = { Log, logAction };