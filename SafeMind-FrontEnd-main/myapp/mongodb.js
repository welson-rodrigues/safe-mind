const mongoose = require('mongoose');
const { logAction } = require('./logs');

const dbURI = 'mongodb+srv://welsonrosendo:ifrn.cn@cluster0.wjg76.mongodb.net/testeConexao';

// Função para conectar ao MongoDB
function connectToMongo() {
    mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch((error) => console.log('Erro ao conectar ao MongoDB:', error));
}

// Função para logar ações no MongoDB
const logUserAction = async (userId, nome, email, ip) => {
  try {
    await logAction(userId, nome, email, ip);
    console.log("Log salvo no MongoDB");
  } catch (error) {
    console.error("Erro ao salvar log no MongoDB:", error);
  }
};

module.exports = { connectToMongo, logUserAction };
