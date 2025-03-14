const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connection = require('./config/database'); 

const SECRET = 'bekinhotools';

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

let blacklist = []; 

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
  
    // Verifica se o token está na blacklist
    connection.query('SELECT * FROM blacklist WHERE token = ?', [token], (err, results) => {
      if (err) {
        console.error('Erro ao verificar token na blacklist:', err);
        return res.status(500).json({ message: 'Erro ao verificar token' });
      }
      if (results.length > 0) {
        return res.status(401).json({ message: 'Token revogado' });
      }
  
      jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token inválido" });
        req.userId = decoded.userId;
        next();
      });
    });
  }
  

app.get('/', (req, res) => {
    res.json({ message: "Tudo ok por aqui!" });
});


app.get('/users', verifyJWT, (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ message: 'Erro ao buscar usuários' });
        }
        res.json(results);
        console.log(req.userId + ' fez esta chamada!');
    });
});


app.post('/login', (req, res) => {
    const { user, password } = req.body;

    // Busca o usuário no banco de dados
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [user, password], (err, results) => {
        if (err) {
            console.error('Erro ao verificar usuário:', err);
            return res.status(500).json({ message: 'Erro ao verificar usuário' });
        }

        // Se não encontrar o usuário ou a senha não bater
        if (results.length === 0) {
            return res.status(401).json({ message: "Usuário ou senha incorretos" });
        }

        const user = results[0]; // Primeiro usuário encontrado
        const userId = user.id;

        const token = jwt.sign({ userId, userName: user.username }, SECRET, { expiresIn: 300 });

        const response = { auth: true, token };
        console.log('Login bem-sucedido:', response); 

        return res.json(response);
    });
});

app.post('/logout', (req, res) => {
    const token = req.headers['x-access-token'];
  
    if (token) {
      connection.query('INSERT INTO blacklist (token) VALUES (?)', [token], (err, results) => {
        if (err) {
          console.error('Erro ao revogar token:', err);
          return res.status(500).json({ message: 'Erro ao revogar token' });
        }
        console.log('Token revogado:', token);
        res.json({ message: 'Logout bem-sucedido' });
      });
    } else {
      res.status(400).json({ message: 'Token não fornecido' });
    }
  });
  

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
