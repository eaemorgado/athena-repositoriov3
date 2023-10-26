var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const uuid = require('uuid');
const mysql = require('mysql');
const flash = require('express-flash');
const app = require('express')

var fabricaDeConexao = require("../../config/connection-factory");
var conexao = fabricaDeConexao();

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "@ITB123456",
//   database: "athenashop",
//   port: 3306
// });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@ITB123456",
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

var ProdutosDAL = require("../models/ProdutosDAL");
var produtosDAL = new ProdutosDAL(conexao);

const path = require('path');
const e = require('express')
const multer = require('multer');


var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

const { body, validationResult } = require("express-validator");

const upload = multer({dest: '../public/img/produtos/'});



router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
  });



  router.get("/", async function(req, res){
    try {

        let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
          
        inicio = parseInt(pagina - 1) * 10
        results = await produtosDAL.FindPage(inicio, 10);
        totReg = await produtosDAL.TotalReg();
        console.log(results)
    
        totPaginas = Math.ceil(totReg[0].total / 10);
    
        var paginador = totReg[0].total <= 10 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }
    
        console.log("auth --> ")
        console.log(req.session.autenticado)
        res.render("pages/home",{ produtos: results, paginador: paginador, autenticado:req.session.autenticado, login: req.res.autenticado} );
      } catch (e) {
        console.log(e); // console log the error so we can see it in the console
        res.json({ erro: "Falha ao acessar dados" });
      }
    
    
//    res.render("pages/adm", {usuarios: results, retorno: null, erros: null, autenticado: req.session.autenticado})
} );

// router.get("/?login=logado", verificarUsuAutorizado([1, 2, 3], "pages/restrito"), async function(req, res){
//     try {

//         let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
          
//         inicio = parseInt(pagina - 1) * 10
//         results = await produtosDAL.FindPage(inicio, 10);
//         totReg = await produtosDAL.TotalReg();
//         console.log(results)
    
//         totPaginas = Math.ceil(totReg[0].total / 10);
    
//         var paginador = totReg[0].total <= 10 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }
    
//         console.log("auth --> ")
//         console.log(req.session.autenticado)
//         res.render("pages/home",{ produtos: results, paginador: paginador, autenticado:req.session.autenticado} );
//       } catch (e) {
//         console.log(e); // console log the error so we can see it in the console
//         res.json({ erro: "Falha ao acessar dados" });
//       }
    
    
// //    res.render("pages/adm", {usuarios: results, retorno: null, erros: null, autenticado: req.session.autenticado})
// } );

// ,{ retorno: null, erros: null, }
router.get('/cadastro', (req, res) => {
    // Lógica para renderizar a página de cadastro
    res.locals.erroLogin = null;
    res.render('pages/cadastro', { listaErros: null, valors: { "nome":"", "senha":"", "email":""} }); // Passe erros ou null, dependendo do seu caso
});

router.get("/home", verificarUsuAutenticado, function(req, res){
    res.render("pages/home",{produtos: results, paginador: paginador, autenticado:req.session.autenticado})}
);

router.get("/login", verificarUsuAutenticado, function(req, res){
    res.render("pages/login", {listaErros:null, retorno: null, erros: null,  valores: {"senha":"","email":""}})}
);

router.get("/usuario", verificarUsuAutenticado, async function(req, res){
    if (req.session.autenticado.autenticado == null) {
        res.render("pages/login")
    } else {
        res.render("pages/usuario",{autenticado: req.session.autenticado, retorno: null, erros: null})}
    }
    
);


router.get("/produto", function(req, res){
    res.render("pages/produto", {retorno: null, erros: null})}
);

// router.get("/usuario", verificarUsuAutenticado, function(req, res){
//     req.session.autenticado.login = req.query.login;
//     res.render("pages/usuario", {retorno: null, erros: null})}
// );

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

 router.get("/adm", verificarUsuAutorizado([3], "pages/restrito"), async function(req, res){
    try {

        let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
          
        inicio = parseInt(pagina - 1) * 5
        results = await usuarioDAL.FindPage(inicio, 5);
        totReg = await usuarioDAL.TotalReg();
        console.log(results)
    
        totPaginas = Math.ceil(totReg[0].total / 5);
    
        var paginador = totReg[0].total <= 5 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }
    
        console.log("auth --> ")
        console.log(req.session.autenticado)
        res.render("pages/adm",{ usuarios: results, paginador: paginador, autenticado:req.session.autenticado} );
      } catch (e) {
        console.log(e); // console log the error so we can see it in the console
        res.json({ erro: "Falha ao acessar dados" });
      }
    
    
//    res.render("pages/adm", {usuarios: results, retorno: null, erros: null, autenticado: req.session.autenticado})
} );



router.get("/painelvendedor", verificarUsuAutorizado([2, 3], "pages/restrito"), async function(req, res){
    try {

        let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
          
        inicio = parseInt(pagina - 1) * 10
        results = await produtosDAL.FindPage(inicio, 10);
        totReg = await produtosDAL.TotalReg();
        console.log(results)
    
        totPaginas = Math.ceil(totReg[0].total / 10);
    
        var paginador = totReg[0].total <= 10 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }
    
        console.log("auth --> ")
        console.log(req.session.autenticado)
        res.render("pages/painelvendedor",{ produtos: results, paginador: paginador, autenticado:req.session.autenticado, login: req.res.autenticado} );
      } catch (e) {
        console.log(e); // console log the error so we can see it in the console
        res.json({ erro: "Falha ao acessar dados" });
      }
    
    
//    res.render("pages/adm", {usuarios: results, retorno: null, erros: null, autenticado: req.session.autenticado})
} );


router.get("/excluir/:id", function (req, res) {
    var query = db.query(
      "DELETE FROM usuarios WHERE ?",
      { id: req.params.id },
      function (error, results, fields) {
        if (error) throw error;
      }
    );  
    res.redirect("/");
  });
  
  router.get("/excluirproduto/:id", function (req, res) {
    var query = db.query(
      "DELETE FROM produtos WHERE ?",
      { id_produto: req.params.id },
      function (error, results, fields) {
        if (error) throw error;
      }
    );  
    res.redirect("/");
  });
  
  

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
router.get("/termos", function(req, res){
  res.render("pages/termos", {retorno: null, erros: null})}
);
router.get("/contato", function(req, res){
  res.render("pages/contato", {retorno: null, erros: null})}
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
        senha: bcrypt.hashSync(req.body.senha, salt)
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
        res.render("pages/login", { email: dadosForm.email });
      }, 1000); 

      console.log(dadosForm)    
})

router.post("/publicarproduto",
    upload.single('file'),
    async function(req, res){
        const formProduto = {
            nome_produto: req.body.nome_produto,
            descricao_produto: req.body.descricao_produto,
            quantidade_produto: req.body.quantidade_produto,
            cores_produto: req.body.cores_produto,
            preco_produto: req.body.preco_produto,
            img_produto: req.body.img_produto
        }
        if (!formProduto.nome_produto || !formProduto.descricao_produto) {
            return res.status(400).send('Por favor, preencha todos os campos.');
        }

        if (!req.file) {
            console.log("Falha no carregamento");
          } else {
            caminhoArquivo = "img/produto/" + req.file.filename;
            formProduto.img_produto = caminhoArquivo
            console.log(req.file)
          }

        const id_produto = uuid.v4();

        const query = 'INSERT INTO produtos (id_produto, nome_produto, descricao_produto, quantidade_produto, cores_produto, preco_produto, img_produto) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [id_produto, formProduto.nome_produto, formProduto.descricao_produto, formProduto.quantidade_produto, formProduto.cores_produto, formProduto.preco_produto, formProduto.img_produto];

        db.query(query, values, (err, result) => {
            if (err) {
              console.error('Erro ao inserir dados no banco de dados:', err);
            } else {
              console.log('Dados inseridos com sucesso!');
            }
          });

          res.render("pages/usuario",{autenticado: req.session.autenticado, retorno: null, erros: null})
    
          console.log(formProduto)    

})

// router.post(
//     "/login",
//     body("email")
//         .isEmail({min:5, max:50})
//         .withMessage("O email deve ser válido"),
//     body("senha")
//         .isStrongPassword()
//         .withMessage("A senha deve ser válida"),



//     // gravarUsuAutenticado(usuarioDAL, bcrypt),
//     function(req, res){

//         const dadosForm = {
//             email: req.body.email,
//             senha: req.body.senha
//         }
//         if (!dadosForm.email || !dadosForm.senha) {
            
//             return res.status(400).send('Por favor, preencha todos os campos.');
//         }
//          const errors = validationResult(req)
//          if(!errors.isEmpty()){
//             req.body.errorMessage = 'Senha incorreta! Tente novamente.';
//              console.log(errors);    
//              return res.render("pages/login", {retorno: null, listaErros: errors, valores: req.body});
//          }
//         // if(req.session.autenticado != null) {
//         //    res.redirect("/");
//         // } else {
//         //      res.render("pages/login", { listaErros: null, retorno: null, valores: req.body})
//         //  }

//         setTimeout(function () {
//              res.render("pages/home", { email: dadosForm.email });
//            }, 1000); 
//     });


    // router.post(
    //     "/login",
    //     body("email")
    //       .isEmail()
    //       .withMessage("O email deve ser válido")
    //       .isLength({ min: 5, max: 50 })
    //       .withMessage("O email deve ter entre 5 e 50 caracteres"),
    //     body("senha")
    //       .isStrongPassword()
    //       .withMessage("A senha deve ser válida"),
      
    //     function (req, res) {
    //       const dadosForm = {
    //         email: req.body.email,
    //         senha: req.body.senha,
    //       };
      
    //       if (!dadosForm.email || !dadosForm.senha) {
    //         return res.status(400).send('Por favor, preencha todos os campos.');
    //       }
    //       const errors = validationResult(req)
    //       if(!errors.isEmpty()){
    //          req.body.errorMessage = 'Senha incorreta! Tente novamente.';
    //           console.log(errors);    
    //           return res.render("pages/login", {retorno: null, listaErros: errors, valores: req.body});
    //       }    
          
    //       if(req.session.autenticado != null) {
    //            res.redirect("/");
    //         } else {
    //               res.render("pages/login", { listaErros: null, retorno: null, valores: req.body})
    //           }
         
    //       setTimeout(function () {
    //         res.render("pages/home", { email: dadosForm.email });
    //       }, 1000);
    //     }
    //   );

    router.post(
        "/login",
        body("email")
          .isLength({ min: 4, max: 45 })
          .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha")
          .isStrongPassword()
          .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
      
        gravarUsuAutenticado(usuarioDAL, bcrypt),
        
        function (req, res) {
          const erros = validationResult(req);
          if (!erros.isEmpty()) {
            
            return res.render("pages/login", { listaErros: erros, dadosNotificacao: null, autenticado: null })
          }
          if (req.session.autenticado != null) {
            //mudar para página de perfil quando existir
            res.redirect("/");
          } else {
            res.render("pages/login", { listaErros: erros, autenticado: req.session.autenticado, dadosNotificacao: { titulo: "Erro ao logar!", mensagem: "E-mail e/ou senha inválidos!", tipo: "error" } })
          }
    });
      

    //   router.get('/usuario', verificarUsuAutorizado([1, 2, 3], verificarUsuAutenticado,"pages/restrito"), async function (req, res) {
    //     try {
    //       req.session.autenticado.login = req.query.login
    //       let results = await usuarioDAL.findID(req.session.autenticado.id);
    //       console.log(results);
    //       let campos = {
    //         nome: results[0].nome, email: results[0].email,
    //         senha: ""
    //       }
    //       res.render("pages/perfilUsuario", { listaErros: null, dadosNotificacao: null, valores: campos, autenticado: req.session.autenticado })
    //     } catch (e) {
    //       res.render("pages/perfilUsuario", {
    //         listaErros: null, dadosNotificacao: null, valores: {
    //           nome: "", email: "", senha: ""
    //         }
    //       })
    //       console.log(e)
    //     }
    //   });





module.exports = router