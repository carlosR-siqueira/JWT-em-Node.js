require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const mysql = require('mysql2');

// Crie uma conexão com o banco de dados MySQL usando as variáveis de ambiente
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Usa a variável de ambiente DB_HOST
  user: process.env.DB_USER, // Usa a variável de ambiente DB_USER
  password: process.env.DB_PASSWORD, // Usa a variável de ambiente DB_PASSWORD
  database: process.env.DB_DATABASE, // Usa a variável de ambiente DB_DATABASE
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

module.exports = connection;
