let express = require('express');
let router = express.Router();
let basicAuth = require('express-basic-auth');
let auth = require(__dirname + "./../model/auth")
//import auth from "../model/auth"
var app = express();


// Auth #3 //
/*
app.use('/login.html', basicAuth({
    authorizer: auth.myAuthorizer,
    unauthorizedResponse: auth.getUnauthorizedResponse */

    //users: { 'MES': 'sii_17_18' },
    /*users: getUsersFromDB(),
    challenge: true,
    realm: 'Ym Terces',
    unauthorizedResponse: getUnauthorizedResponse*/

//}));




router.post('/processLogin', function (req, res) {

    basicAuth({
        authorizer: auth.myAuthorizer,
        unauthorizedResponse: auth.getUnauthorizedResponse
   
    })

    /*
    let response = {
        email: req.body.email,
        password: req.body.password
    };
*/


   // console.log('response_ ' +  response);

    //res.send(JSON.stringify(response));
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

*/

router.get('*', function (req, res) {
    res.send('Erro, URL inválido.');
});