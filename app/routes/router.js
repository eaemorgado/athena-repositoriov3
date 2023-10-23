var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const uuid = require('uuid');
const mysql = require('mysql')

var fabricaDeConexao = require("../../config/connection-factory");
var conexao = fabricaDeConexao();

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "athenashop",
    port: 3306
  });

  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Conectado ao MySQL');
  });

var UsuarioDAL = require("../models/UsuarioDAL");
var usuarioDAL = new UsuarioDAL(conexao);

var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

const {body, validationResult } = require("express-validator");

router.get("/", verificarUsuAutenticado, function (req, res) {
    req.session.autenticado.login = req.query.login;
    res.render("pages/home", req.session.autenticado);
  });

router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
  });

// ,{ retorno: null, erros: null, }
router.get('/cadastro', (req, res) => {
    // Lógica para renderizar a página de cadastro
    res.locals.erroLogin = null;
    res.render('pages/cadastro', { listaErros: null, valors: { "nome":"", "senha":"", "email":""} }); // Passe erros ou null, dependendo do seu caso
});

router.get("/home", verificarUsuAutenticado, function(req, res){
    res.render("pages/home", req.session.autenticado,{retorno: null, erros: null})}
);

router.get("/sair", limparSessao, function(req,res){
    res.redirect("/");
})

router.get("/login", function(req, res){
    res.render("pages/login", {listaErros:null, retorno: null, erros: null,  valores: {"tsenha":"","temail":""}})}
);

router.get("/produto", function(req, res){
    res.render("pages/produto", {retorno: null, erros: null})}
);

router.get("/usuario", function(req, res){
    res.render("pages/usuario", {retorno: null, erros: null})}
);

router.get("/notifi", function(req, res){
    res.render("pages/notifi", {retorno: null, erros: null})}
);

router.get("/compras", function(req, res){
    res.render("pages/compras", {retorno: null, erros: null})}
);

router.get("/favoritos", function(req, res){
    res.render("pages/favoritos", {retorno: null, erros: null})}
);

router.get("/config", function(req, res){
    res.render("pages/config", {retorno: null, erros: null})}
);

router.get("/adm", function(req, res){
    res.render("pages/adm", {retorno: null, erros: null})}
);

router.get("/carrinho", function(req,res){
    res.render("pages/carrinho", {retorno: null, erros: null})
});

router.get("/historico", function(req, res){
    res.render("pages/historico", {retorno: null, erros: null})
});

router.get("/dados", function(req, res){
    res.render("pages/dados", {retorno: null, erros: null})
});

router.post("/produto", function(req, res){
    res.json(req.body)
});

router.get("/produto", function(req, res){
    res.render("pages/produto", {retorno: null, erros: null})
});

router.get("/anunciar", function(req, res){
    res.render("pages/anunciar", {retorno:null, erros:null})
});

router.get("/pagaconcluido", function(req, res){
    res.render("pages/pagaconcluido", {retorno: null, erros: null})
});

router.get("/pagacancelado", function(req, res){
    res.render("pages/pagacancelado", {retorno: null, erros: null})
});

router.get("/addprod", function(req, res){
    res.render("pages/addprod", {retorno: null, erros: null})
});

router.get("/formenviado", function(req, res){
    res.render("pages/formenviado", {retorno: null, erros: null})}
);
router.get("/politica", function(req, res){
    res.render("pages/politica", {retorno: null, erros: null})}
);


// Defina o sal para o bcrypt
const saltRounds = 10;

// router.post(
//   '/cadastrar',
//   async function (req, res) {
//     const erros = validationResult(req);

//     if (!erros.isEmpty()) {
//       return res.render('pages/cadastro', {
//         retorno: null,
//         listaErros: erros.array(),
//         valors: req.body,
//       });
//     }

//     try {
//       const dadosForm = {
//         nome: req.body.nome,
//         email: req.body.email,
//         senha: bcrypt.hashSync(req.body.senha, saltRounds)
//       };

//         // Supondo que "usuarioDAL.create" seja a função que insere os dados no banco de dados.
//         // Certifique-se de tratá-la adequadamente no seu código.

//         // const create = await usuarioDAL.create(dadosForm);

//         // Após inserir os dados no banco de dados, você pode redirecionar o usuário para outra página.

//         //   Cadastrar o usuário
//         const create = await usuarioDAL.create(dadosForm);

//       res.redirect('/');
//     } catch (e) {
//       res.render('pages/cadastro', {
//         listaErros: null,
//         retorno: null,
//         valors: req.body,
//       });
//     }
//   }
// );


router.post("/cadastrar", 
    body("email")
    .isEmail({min:5, max:50})
    .withMessage("O email deve ser válido"),
    body("senha")
    .isStrongPassword()
    .withMessage("A senha deve ser válida"),

    async function(req, res){
    
    const dadosForm = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    }
    if (!dadosForm.email || !dadosForm.senha) {
        return res.status(400).send('Por favor, preencha todos os campos.');
    }
    const id = uuid.v4();

    const query = 'INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?)';
    const values = [id, dadosForm.nome, dadosForm.email, dadosForm.senha];

    db.query(query, values, (err, result) => {
        if (err) {
          console.error('Erro ao inserir dados no banco de dados:', err);
        } else {
          console.log('Dados inseridos com sucesso!');
        }
      });

      setTimeout(function () {
        res.render("pages/formenviado", { email: dadosForm.email });
      }, 1000); 

      console.log(dadosForm)
})

router.post(
    "/login",
    body("email")
        .isEmail({min:5, max:50})
        .withMessage("O email deve ser válido"),
    body("senha")
        .isStrongPassword()
        .withMessage("A senha deve ser válida"),



    // gravarUsuAutenticado(usuarioDAL, bcrypt),
    function(req, res){

        const dadosForm = {
            email: req.body.email,
            senha: req.body.senha
        }
        if (!dadosForm.email || !dadosForm.senha) {
            return res.status(400).send('Por favor, preencha todos os campos.');
        }
         const errors = validationResult(req)
         if(!errors.isEmpty()){
             console.log(errors);    
             return res.render("pages/login", {retorno: null, listaErros: errors, valores: req.body});
         }
        // if(req.session.autenticado != null) {
        //    res.redirect("/");
        // } else {
        //      res.render("pages/login", { listaErros: null, retorno: null, valores: req.body})
        //  }

        setTimeout(function () {
             res.render("pages/home", { email: dadosForm.email });
           }, 1000); 
    });


module.exports = router