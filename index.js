const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SECRET = 'luiztools'

app.use(bodyParser.json());

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    const index = blacklist.findIndex(item => item ===  token);
    if(index !== -1) return res.status(401).end()


    jwt.verify(token, SECRET, (err, decoded) =>{
        if(err)  return res.status(401).end();

        req.userId = decoded.userId;
        next();
    })
}

app.get('/', (req, res) => {
    res.json({ message: "Tudo ok por aqui!" });
});

app.get('/clientes', verifyJWT, (req, res) => {
        
        const clientes = [
            { id: 1, nome: 'luiz' },
            { id: 2, nome: 'Bekinho' }
        ];
        console.log(req.userId + ' fez esta chamada!');
        
        res.json(clientes);
    
    
    
});

app.post('/login', (req, res) => {

   
    if (req.body.user === 'Bekinho' && req.body.password === '123'  || req.body.user === 'luiz' && req.body.password === '123') {
        const token = jwt.sign({userId: 2 }, SECRET, { expiresIn: 300 })
        return res.json({auth: true, token});
    }
    
    res.status(401).end();
});
const blacklist = []

app.post('/logout', function (req, res){
    blacklist.push(req.headers['x-access-token'])
    console.log(blacklist);
    res.end()
})


// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
