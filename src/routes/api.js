const express = require('express');
const router = express.Router();

// !!!!!!
const app = require("../../app.js").app;
//let app = express(); //////////////////////////
let auth = require(__dirname + "./../model/auth")

// Temp - alterar para limitar import ao estritamente necessário 
//const users = require('../model/db/users');
//console.log(users.CollectionName); // teste

router.post('/processLogin', function (req, res) {
    
    //console.log(req.body.email);
    //console.log(req.body.password);
    

    //console.log(app.locals.teste);
    
    
    //console.log(dbConnection);
    
    // alterar validateUser...
    if (auth.validateUser(req.body.email, req.body.password)) {
        res.redirect(__dirname + './../../public/index.html');
        //res.json('{ success: false }');


        //res.status(401).send('login.html');

        //window.alert('ERRO');
    } 
    res.send('false');
    /*
        let response = {
            email: req.body.email,
            password: req.body.password
        };
    */

    //res.send(JSON.stringify(response));

    //res.send(JSON.stringify('false'));

});


module.exports = router;

/*
let contador = [];
router.use(function (req, res, next) {
    function contagem() {
        if (contador.length === 0) {
            return 0;
        }
        for (let i = 0; i < contador.length; i++) {
            if (contador[i].method === req.method.toString() && contador[i].url === '/api' + req.url.toString()) {
                contador[i].count++;
                return -1;
            }
        }
        return 0;
    }
    if (contagem() === 0) {
        contador.push({
            count: 1,
            method: req.method,
            url: req.originalUrl
        });
    }

    console.log(contador.sort((a, b) => {
        return b.count - a.count;
    }));

    next();
});

// 6.
router.use(function (req, res, next) {
    const data = new Date();
    const apiRequestsString = '' + data.toISOString() + ': IP: ' + req.ip + ' + URL: ' + req.url + "\r\n";
    escreverFicheiro('api-requests', apiRequestsString);
    next();
});

router.get("/listaralunos", function (req, res) {
    res.send(JSON.stringify(alunos));
});

router.get('/alunos', function (req, res) {
    res.send(JSON.stringify(alunos));
});

router.get('/alunos/:numero', function (req, res) {
    res.send(JSON.stringify(alunos.find(a => a.numero == req.params.numero)));
});

router.post('/alunos', function (req, res) {
    let response = {
        numero: req.body.numero,
        nome: req.body.nome,
        morada: req.body.morada,
        notafinal: req.body.notafinal
    };
    alunos.push(response);
    const alunosString = JSON.stringify(alunos);
    escreverFicheiro('alunos', alunosString);
    res.send(JSON.stringify(response));
});

router.post('/processarformulario', function (req, res) {
    let response = {
        numero: req.body.numero,
        nome: req.body.nome,
        morada: req.body.morada,
        notafinal: req.body.notafinal
    };
    alunos.push(response);
    res.send(JSON.stringify(response));
});

router.put('/alunos/:numero', function (req, res) {
    for (let i = 0; i < alunos.length; i++) {
        if (alunos[i].numero === req.params.numero) {
            alunos[i].numero = req.params.numero;
            alunos[i].nome = req.body.nome;
            alunos[i].morada = req.body.morada;
            alunos[i].notafinal = req.body.notafinal;
        }
    }
    res.send(JSON.stringify(alunos));
});

router.delete('/alunos/:numero', function (req, res) {
    let indice = 0;
    for (let i = 0; i < alunos.length; i++) {
        if (alunos[i].numero === req.params.numero) {
            indice = i;
            break;
        }
    }
    alunos.splice(indice, 1)
    res.send(JSON.stringify(alunos));
});

function escreverFicheiro(nome, conteudo) {
    switch (nome) {
        case 'alunos':
            fs.writeFile(__dirname + '/../alunos.json', conteudo, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        case 'api-requests':
            fs.appendFile(__dirname + '/../api-requests.txt', conteudo, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        default:
            return;
    }
}


// 4.
router.get("/alunos/:nome([a-zA-Z]{3})", function (req, res) {
    let aux = [];
    for (let i = 0; i < alunos.length; i++) {
        if (alunos[i].nome.includes(req.params.nome)) {
            aux.push(alunos[i]);
        }
    }
    res.send(JSON.stringify(aux));
});
// http://localhost:8081/api/alunos/nue
// The character encoding of the plain text document was not declared. The document will render with garbled text in some browser configurations if the document contains characters from outside the US-ASCII range. The character encoding of the file needs to be declared in the transfer protocol or file needs to use a byte order mark as an encoding signature

// 3.
router.get('*', function (req, res) {
    res.send('Erro, URL inválido.');
});
*/

