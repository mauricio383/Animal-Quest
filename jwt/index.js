// Adicionando o Fetch ao node.
const fetch = require('node-fetch');
// Adicionando o pacote que resolver o problema de cors da API.
const cors = require('cors');

// Adicionando o JWT.
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

// Adicionando pacotes para o servidor rodar.
const http = require('http'); 
const express = require('express') 
const app = express() 
const cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');

// Adiciona o pacote para fazer as consultas MySQL.
const mysql = require('mysql');

// Configurando a conexão com o banco MySQL.
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'app_pesquisa',
    password: 'e706c0f6416a27764396e775bfb9cd93541068e742e1891d719d555674fd03bb',
    database: 'pesquisa'
});

// Conectando a aplicação ao banco.
dbConn.connect();

//Blibioteca para criptografar senha.
const {SHA224} = require("sha2");

app.use((req, res, next) => {
    // Qual site tem permissão de realizar a conexão.
    // O "*" define que qualquer site pode usar a API.
    res.header("Access-Control-Allow-Origin", "*");
    // Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

// Definindo rota inicial.
app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
});

// Define a rota que faz o login e retorna o token.
app.post('/login', (req, res, next) => {
    const {usuario, senha} = req.body;
    // criptografada 
    const senhaCri = SHA224(senha.toString()).toString("hex");
    
    // Faz a consulta no banco de dados.
    dbConn.query(`SELECT * FROM usuario WHERE nome = '${usuario.toString()}' AND senha = '${senhaCri}'`, function(error, results, fields) {
        // Testa se deu algum erro, caso tenha lança uma execessão.
        if (error) throw error;
        
        // Testa se a consulta trouxe algum dado.
        if (results.length > 0) {
            const {id} = results[0]; 
            
            // Gera o token
            const token = jwt.sign({ id }, process.env.SECRET, {
                // Faz que o token dure 2 horas.
                expiresIn: (60 * 60 * 2)
            });
            
            // Retorno do token.
            console.log("Autorizado!");
            return res.json({ autorizacao: true, token: token });
        } else {
            // Retorno para caso a autenticação não seja bem sucedida.
            console.log("Não autorizado!");
            res.status(500).json({message: 'Login inválido!'});
        }
    });
});

// Define a rota que faz o logout da conta.
app.post('/logout', function(req, res) {
    console.log("Logout feito com sucesso!");
    res.json({ autorizacao: false, token: null });
});

// Define a rota de cadastro de usuários.
app.post('/cadastro', (req, res, next) => {
    // Pega os dados passados no corpo da requisição.
    const {usuario, senha} = req.body;
    
    // Faz inserção no banco de dados.
    dbConn.query(`INSERT INTO usuario (id, nome, senha) VALUES (NULL, "${usuario}", SHA2("${senha}", 224))`, function(error, results, fields) {
        // Testa se deu algum erro, caso tenha lança uma execessão.
        if (error) throw error;
        
        return res.json(req.body);
    });
});

// Define a rota para buscar as pesquisas.
app.get('/pesquisa', (req, res, next) => {
    // Faz a consulta no banco de dados.
    dbConn.query('SELECT * FROM pergunta', function(error, results, fields) {
        // Testa se deu algum erro, caso tenha lança uma execessão.
        if (error) throw error;
        
        // Testa se a consulta trouxe algum dado.
        if (results.length > 0) {
            // Caso tenha trago retorna os dados.
            return res.json(results);
        } else {
            // Caso não tenha trago retorna a mensagem abaixo.
            return res.json({ mensagem: "Não veio dados." });
        }
    });
});

// Definindo rota para adicionar pesquisas.
app.post('/pesquisa', verifyJWT, (req, res, next) => {
    // Pega os dados passados no corpo da requisição.
    const {pergunta: enunciado, a, b, c, d, correta} = req.body;
    
    // Faz inserção no banco de dados.
    dbConn.query(`INSERT INTO pergunta (id, enunciado, a, b, c, d, correta) VALUES (NULL, "${enunciado}", "${a}", "${b}", "${c}", "${d}", "${correta}")`, function(error, results, fields) {
        // Testa se deu algum erro, caso tenha lança uma execessão.
        if (error) throw error;
        
        return res.json(req.body);
    });
});

// Inicia o servidor com as rotas na porta 3001.
const server = http.createServer(app); 
server.listen(3001);
console.log("Servidor escutando na porta 3001...");

// Função que faz a verificação do token.
function verifyJWT(req, res, next){
    // Puxa o token do header.
    const token = req.headers['x-access-token'];
    
    // Confere se o token não existe.
    if (!token) {
        // Retorno caso ele não exista.
        return res.status(401).json({ auth: false, message: 'Você não tem o token.' });
    }
    
    // Verificação para ver se o token é válido.
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        
        // Testa se ocorreu algum erro.
        if (err) {
            // Retorno caso tenha ocorrido algum erro.
            return res.status(500).json({ auth: false, message: 'Falha ao autenticar o token.' });
        }
        
        // Retorno caso o token exista e seja válido.
        req.userId = decoded.id;
        next();
    });
}