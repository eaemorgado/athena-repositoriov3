var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const uuid = require('uuid');
const mysql = require('mysql2');
const flash = require('express-flash');
const app = require('express')

const multer = require('multer');
const path = require('path');
// ****************** Versão com armazenamento em diretório
// Definindo o diretório de armazenamento das imagens
var storagePasta = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './app/public/img/produto/') // diretório de destino  
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    //renomeando o arquivo para evitar duplicidade de nomes
  }
})

var upload = multer({ storage: storagePasta });


var fabricaDeConexao = require("../../config/connection-factory");
var conexao = fabricaDeConexao();

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "@ITB123456",
//   database: "athenashop",
//   port: 3306
// });

// const db = mysql.createConnection({
//   host:   "viaduct.proxy.rlwy.net",
//   user:   "root",
//   password:   "c1D5BfbbgEh54Faa6bhEbd45GC5D3CGf",
//   database:   "railway",
//   port:   "33808"
//   });

  const db = mysql.createConnection({
    host:   "localhost",
    user:   "root",
    password:   "@ITB123456",
    database:   "athenashop",
    port:   "3306"
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

// const path = require('path');
// const e = require('express')
// const multer = require('multer');


var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

const { body, validationResult } = require("express-validator");





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


router.get("/produto", async function(req, res){
      try {
        result = await produtosDAL.findID(req.body.id_produto);
        console.log(result);
        console.log("prod -->");
        console.log(req.session.autenticado);
        res.render("pages/produto", {produtos: result, autenticado:req.session.autenticado, login:req.res.autenticado});
      } catch (e) {
        console.log(e); // console log the error so we can see it in the console
        res.json({ erro: "Falha ao acessar dados" });
      }
}
);

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
    res.render('pages/cadastro', { listaErros: null, dadosNotificacao: null, valors: { "nome":"", "senha":"", "email":""} }); // Passe erros ou null, dependendo do seu caso
});

router.get("/home", verificarUsuAutenticado, function(req, res){
    res.render("pages/home",{produtos: results, paginador: paginador, autenticado:req.session.autenticado})}
);

router.get("/login", verificarUsuAutenticado, function(req, res){ res.locals.erroLogin = null
  res.render("pages/login", { listaErros: null, dadosNotificacao: null});}
);

router.get("/usuario", verificarUsuAutenticado, async function(req, res){
    if (req.session.autenticado.autenticado == null) {
        res.redirect("/login")
    } else {
        res.render("pages/usuario",{autenticado: req.session.autenticado, retorno: null, erros: null})}
    }
    
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
  
  
router.get("/cartao", function(req,res){
  res.render("pages/cartao", {retorno: null, erros: null})
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
    res.render("pages/anunciar", {listaErros: null, dadosNotificacao: null})
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

router.get("/user_dados", async function(req, res){
  results = await usuarioDAL.findID
  res.render("pages/user_dados", {retorno: null, erros: null, autenticado: req.session.autenticado, usuarios: results})}
);
// Defina o sal para o bcrypt
const saltRounds = 10;



router.post("/cadastrar",
  body("nome")
    .isLength({ min: 3, max: 50 }).withMessage("Mínimo de 3 letras e máximo de 50!"),
  body("email")
    .isEmail().withMessage("Digite um e-mail válido!"),
  body("senha")
    .isStrongPassword()
    .withMessage("A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 caractere especial e 1 número"),
  async function (req, res) {
    var dadosForm = {
      nome: req.body.nome,
      email: req.body.email,
      senha: bcrypt.hashSync(req.body.senha, salt),
    };
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.render("pages/cadastro", { listaErros: erros, dadosNotificacao: null, valores: req.body })
    }
    try {
      let insert = await usuarioDAL.create(dadosForm);
      console.log(insert);
      res.render("pages/cadastro", {
        listaErros: null, dadosNotificacao: {
          titulo: "Cadastro realizado!", mensagem: "Usuário criado com o id " + insert.insertId + "!", tipo: "success"
        }, valores: req.body
      })
    } catch (e) {
      res.render("pages/cadastro", {
        listaErros: erros, dadosNotificacao: {
          titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
        }, valores: req.body
      })
    }
  });


  router.post("/publicarproduto",
  upload.single('img_produto'),
  async function(req, res){
    const formProduto = {
        nome_produto: req.body.nome_produto,
        descricao_produto: req.body.descricao_produto,
        quantidade_produto: req.body.quantidade_produto,
        cores_produto: req.body.cores_produto,
        preco_produto: req.body.preco_produto,
        img_produto: req.body.img_produto
    }
    if (!req.file) {
      console.log("Falha no carregamento");
    } else {
      caminhoArquivo = "img/produto/" + req.file.filename;
      formProduto.img_produto = caminhoArquivo
      console.log(req.file)
    }
    try {
      let insert = await produtosDAL.create(formProduto);
      console.log(insert);
      res.render("pages/anunciar", {
        listaErros: null, dadosNotificacao: {
          titulo: "Produto Publicado!", mensagem: "Produto publicado com o id " + insert.insertId + "!", tipo: "success"
        }, valores: req.body
      })
    } catch (e) {
      res.render("pages/anunciar", {
        listaErros: erros, dadosNotificacao: {
          titulo: "Erro ao publicar!", mensagem: "Verifique os valores digitados!", tipo: "error"
        }, valores: req.body
      })
    }
  }
  
  )

// router.post("/publicarproduto",
//     upload.single('img_produto'),
//     async function(req, res){
//         const formProduto = {
//             nome_produto: req.body.nome_produto,
//             descricao_produto: req.body.descricao_produto,
//             quantidade_produto: req.body.quantidade_produto,
//             cores_produto: req.body.cores_produto,
//             preco_produto: req.body.preco_produto,
//             img_produto: req.body.img_produto
//         }
//         if (!formProduto.nome_produto || !formProduto.descricao_produto) {
//             return res.status(400).send('Por favor, preencha todos os campos.');
//         }

//         if (!req.file) {
//             console.log("Falha no carregamento");
//           } else {
//             caminhoArquivo = "img/produto/" + req.file.filename;
//             formProduto.img_produto = caminhoArquivo
//             console.log(req.file)
//           }

//         const id_produto = uuid.v4();

//         const query = 'INSERT INTO produtos (id_produto, nome_produto, descricao_produto, quantidade_produto, cores_produto, preco_produto, img_produto) VALUES (?, ?, ?, ?, ?, ?, ?)';
//         const values = [id_produto, formProduto.nome_produto, formProduto.descricao_produto, formProduto.quantidade_produto, formProduto.cores_produto, formProduto.preco_produto, formProduto.img_produto];

//         db.query(query, values, (err, result) => {
//             if (err) {
//               console.error('Erro ao inserir dados no banco de dados:', err);
//             } else {
//               console.log('Dados inseridos com sucesso!');
//             }
//           });

//           res.render("pages/usuario",{autenticado: req.session.autenticado, retorno: null, erros: null})
    
//           console.log(formProduto)    

// })




    router.post(
      "/login",
      body("email")
        .isLength({ min: 4, max: 45 })
        .withMessage("O nome de usuário/e-mail esta incorreto!"),
      body("senha")
        .isStrongPassword()
        .withMessage("Verifique novamente a senha digitada!"),
    
      gravarUsuAutenticado(usuarioDAL, bcrypt),
      function (req, res) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
          return res.render("pages/login", { listaErros: erros, dadosNotificacao: null })
        }
        if (req.session.autenticado != null) {
          res.render("pages/login", {
            listaErros: null, dadosNotificacao: {
              titulo: "Login realizado!", mensagem: "Usuário logado com sucesso", tipo: "success"
            }, valores: req.body
          })
        } else {
          res.render("pages/login", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" } })
        }
      });
    
      



module.exports = router