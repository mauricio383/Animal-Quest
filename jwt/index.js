// Adicionando o Fetch ao node.
const fetch = require('node-fetch');
// Adicionando o pacote que resolver o problema de cors da API.
const cors = require('cors');

// Adicionando o JWT.
require("dotenv-safe").config();
var jwt = require('jsonwebtoken');
 
// Adicionando pacotes para o servidor rodar.
var http = require('http'); 
const express = require('express') 
const app = express() 
var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');

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
        // Fetch que acessa o banco de dados e retorna a lista de usuários.
        fetch('https://api.sheety.co/923090dcb0591f446fe08a985a6c76c3/animalQuest/usuarios')
        .then(resFetch => resFetch.json())
        .then(json => {
            // Lista de usuário.
            const usuarios = json.usuarios;
    
            // Laço que percorre a lista de dados.
            usuarios.forEach((usuario) => {
                // Verificação para ver se os dados passados...
                // ...batem com algum valor do banco de dados.
                if(req.body.usuario.toString() === usuario.usuario && req.body.senha === usuario.senha.toString()) {
                    // Autorização bem sucedida.
                    const id = usuario.id;
    
                    // Gera o token
                    var token = jwt.sign({ id }, process.env.SECRET, {
                        // Faz que o token dure 2 horas.
                        expiresIn: (60 * 60 * 2)
                    });
    
                    // Retorno do token.
                    console.log("Autorizado!");
                    return res.json({ autorizacao: true, token: token });
                }
            });
    
            // Retorno para caso a autenticação não seja bem sucedida.
            console.log("Não autorizado!");
            res.status(500).json({message: 'Login inválido!'});
        })
        .catch(erro => res.json(erro));
});

// Define a rota que faz o logout da conta.
app.post('/logout', function(req, res) {
    console.log("Logout feito com sucesso!");
    res.json({ autorizacao: false, token: null });
});

// Define a rota de cadastro de usuários.
app.post('/cadastro', (req, res, next) => {
    const body = {
        usuario: {
            "usuario": req.body.usuario,
            "senha": req.body.senha
        }
    }
    // Fetch para adicionar um novo usuário ao banco de dados.
    fetch('https://api.sheety.co/923090dcb0591f446fe08a985a6c76c3/animalQuest/usuarios', {
        method: 'POST',
        // Dado que será adicionado
        body: JSON.stringify(body),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then((response) => response.json())
    .then(json => {
        console.log("Cadastro realizado com sucesso!");
        res.json(json);
    })
    .catch(erro => res.json(erro));
});

// Inicia o servidor com as rotas na porta 3001.
var server = http.createServer(app); 
server.listen(3001);
console.log("Servidor escutando na porta 3001...");

// Função que faz a verificação do token.
function verifyJWT(req, res, next){
    // Puxa o token do header.
    var token = req.headers['x-access-token'];

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