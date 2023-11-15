var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
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

//  const db = mysql.createConnection({
//    host: "localhost",
//    user: "root",
//    password: "@ITB123456",
//    database: "athenashop",
//    port: 3306
//  });


 const db = mysql.createConnection({
   host: "monorail.proxy.rlwy.net",
   user: "root",
   password: "aEg3e4HcD5B14bA3bHAGF6254A5g-Cdc",
   database: "railway",
   port: "34180"
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

var FavoritosDAL = require("../models/FavoritosDAL");
var favoritosDAL = new FavoritosDAL(conexao);

// const path = require('path');
// const e = require('express')
// const multer = require('multer');


var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

const { body, validationResult } = require("express-validator");





router.get("/sair", limparSessao, function (req, res) {
  res.redirect("/");
});


// { produtoscarrinho: result }
// router.get("/", verificarUsuAutenticado, async function (req, res) {
  
//   try {
//     const id_usuario = req.session.autenticado.id;
//     console.log('ID do usuário logado:', id_usuario);

//     const sql = 'SELECT id_produto FROM carrinho WHERE id_usuario = ?';
//     db.query(sql, id_usuario, (err, result) => {
//       if (err) {
        
//       } else {
//         const produtosFavoritados = result.map(row => row.id_produto);
//         const queryProdutos = 'SELECT * FROM produtos WHERE id_produto IN (?)';
        
//         db.query(queryProdutos, [produtosFavoritados], (err, result) => {
//           if (err) {
//             res.status(500).send('Erro ao buscar detalhes dos produtos favoritados');
//           } else {
            
//           }
//         });
//       }
//     });



//     let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;

//     inicio = parseInt(pagina - 1) * 10
//     resultsprod = await produtosDAL.FindPage(inicio, 10);
//     totReg = await produtosDAL.TotalReg();
//     // console.log(results)

//     totPaginas = Math.ceil(totReg[0].total / 10);

//     var paginador = totReg[0].total <= 10 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }

//     // console.log("auth --> ")
//     // console.log(req.session.autenticado)
//     res.render("pages/home", {produtos: resultsprod, paginador: paginador, autenticado: req.session.autenticado, login: req.res.autenticado });
//   } catch (e) {
//     console.log(e); // console log the error so we can see it in the console
//     res.json({ erro: "Falha ao acessar dados" });
//   }

// });

// Módulo para buscar produtos Carriho
// async function buscarProdutosCarrinho(req) {
//   return new Promise((resolve, reject) => {
//     const id_usuario = req.session.autenticado.id;
//     const sql = 'SELECT id_produto FROM carrinho WHERE id_usuario = ?';

//     db.query(sql, [id_usuario], (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         const produtosCarrinho = result.map(row => row.id_produto);
//         resolve(produtosCarrinho);
//       }
//     });
//   });
// }

// async function buscarProdutosCarrinho(req) {
//   return new Promise((resolve, reject) => {
//     const id_usuario = req.session.autenticado.id;
//     const sql = 'SELECT id_produto FROM carrinho WHERE id_usuario = ?';

//     db.query(sql, [id_usuario], (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         const produtosCarrinho = result.map(row => row.id_produto);

//         // Consulta para buscar os detalhes dos produtos na tabela 'produtos'
//         const queryProdutos = `SELECT * FROM produtos WHERE id_produto IN (?)`;

//         db.query(queryProdutos, [produtosCarrinho], (err, resultProdutos) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(resultProdutos);
//           }
//         });
//       }
//     });
//   });
// }


// async function buscarProdutosCarrinho(req) {
//   return new Promise((resolve, reject) => {
//     const id_usuario = req.session.autenticado ? req.session.autenticado.id : null;
    
//     if (!id_usuario) {
//       // Lógica para lidar com o caso em que nenhum usuário está logado
//       // Por exemplo, você pode retornar uma lista vazia de produtos do carrinho
//       resolve([]);
//     } else {
//       const sql = 'SELECT id_produto FROM carrinho WHERE id_usuario = ?';
      
//       db.query(sql, [id_usuario], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           const produtosCarrinho = result.map(row => row.id_produto);

//           const queryProdutos = `SELECT * FROM produtos WHERE id_produto IN (?)`;

//           db.query(queryProdutos, [produtosCarrinho], (err, resultProdutos) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(resultProdutos);
//             }
//           });
//         }
//       });
//     }
//   });
// }


async function buscarProdutosCarrinho(req) {
  return new Promise((resolve, reject) => {
    const id_usuario = req.session.autenticado ? req.session.autenticado.id : null;
    
    if (!id_usuario) {
      // Se nenhum usuário estiver logado, resolve com uma lista vazia de produtos
      resolve([]);
    } else {
      const sql = 'SELECT id_produto FROM carrinho WHERE id_usuario = ?';
      
      db.query(sql, [id_usuario], (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Verifica se há produtos no carrinho
          if (result.length === 0) {
            // Se não houver produtos, resolve com uma lista vazia
            resolve([]);
          } else {
            const produtosCarrinho = result.map(row => row.id_produto);

            const queryProdutos = `SELECT * FROM produtos WHERE id_produto IN (?)`;

            db.query(queryProdutos, [produtosCarrinho], (err, resultProdutos) => {
              if (err) {
                reject(err);
              } else {
                resolve(resultProdutos);
              }
            });
          }
        }
      });
    }
  });
}


// Rota para renderizar a página inicial
router.get("/", verificarUsuAutenticado, async function (req, res) {
  try {
    const produtosCarrinho = await buscarProdutosCarrinho(req);

    // Lógica para buscar os produtos para exibir na página inicial
    let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
    inicio = parseInt(pagina - 1) * 10
    resultsprod = await produtosDAL.FindPage(inicio, 10);
    totReg = await produtosDAL.TotalReg();
    totPaginas = Math.ceil(totReg[0].total / 10);
    var paginador = totReg[0].total <= 10 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }

    res.render("pages/home", { produtos: resultsprod, paginador: paginador, autenticado: req.session.autenticado, login: req.res.autenticado, produtosCarrinho: produtosCarrinho });
  } catch (e) {
    console.log(e);
    res.json({ erro: "Falha ao acessar dados" });
  }
});

router.get("/addcarrinho/:id_produto/:id", function (req, res){
  var query = db.query (
    "insert into carrinho set ?",
    {id_produto: req.params.id_produto,
    id_usuario: req.params.id
    },
    function (error, results, fields) {
      if (error) throw error;
    }
  )
  res.redirect("/");
})


router.get('/favoritos/:id', verificarUsuAutenticado,(req, res) => {
  const id_usuario = req.params.id; // Supondo que o ID do usuário está na sessão
  console.log('ID do usuário logado:', id_usuario);
  const sql = 'SELECT id_produto FROM favoritos WHERE id_usuario = ?';
  
  db.query(sql, id_usuario, (err, result) => {
    if (err) {
      res.status(500).send('Erro ao buscar favoritos');
    } else {
      const produtosFavoritados = result.map(row => row.id_produto);
      const queryProdutos = 'SELECT * FROM produtos WHERE id_produto IN (?)';
      
      db.query(queryProdutos, [produtosFavoritados], (err, result) => {
        if (err) {
          res.status(500).send('Erro ao buscar detalhes dos produtos favoritados');
        } else {
          res.render('pages/favoritos', { produtos: result });
        }
      });
    }
  });
});

router.get("/excluirprodutocart/:id", function (req, res) {
  var query = db.query(
    "DELETE FROM carrinho WHERE ?",
    { id_produto: req.params.id },
    function (error, results, fields) {
      if (error) throw error;
    }
  );
  res.redirect("/");
});




// router.get("/produto/:id_produto", async function(req, res){
//       try {
//         result = await produtosDAL.findID(1);
//         console.log(result);
//         console.log("prod -->");
//         console.log(req.session.autenticado);
//         res.render("pages/produto", {produtos: result, autenticado:req.session.autenticado, login:req.res.autenticado});
//       } catch (e) {
//         console.log(e); // console log the error so we can see it in the console
//         res.json({ erro: "Falha ao acessar dados" });
//       }
// }
// );

// router.get("/produto/:nome_produto", function (req, res, next) {

//     var nome_produto = req.params.nome_produto;
//     var query   = `SELECT * FROM produtos WHERE nome_produto = "${nome_produto}"`;
//     db.query(query, function(error, produto){
//       res.render('pages/produto', {title: "Produto aberto", action: "prod", produto:nome_produto[0]})
//     })


// });




router.get("/produto/:id_produto", async function (req, res) {
  try {
    result = await produtosDAL.findID(req.params.id_produto)
    console.log(result)
    res.render("pages/produto", { produtos: result, autenticado: req.session.autenticado, login: req.res.autenticado })

  } catch {
    res.redirect("/")
  }
})


// router.get("/produto/:id_produto", async function(req, res){
//   // console.log(req.params.id_produto)
//   try {
//     var id_produto = req.params.id_produto;
//     console.log(id_produto)
//     var query = `SELECT * FROM produtos WHERE id_produto = "${id_produto}"`;
//     db.query(query, function(error, produto){
//       res.render("pages/produto", {produ})
//     })
//   } catch {

//   }

// })


// router.get("/produto/:id_produto", async function(req, res){
//   var id_produto = req.params.id_produto;
//   var query = db.query(
//     "SELECT id_produto, nome_produto, descricao_produto, " +
//     `quantidade_produto, cores_produto, preco_produto, img_produto FROM produtos WHERE id_produto = ${id_produto}` ,
//   )

//     res.render("pages/produto", {produtos: query})

// })





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
  res.render('pages/cadastro', { listaErros: null, dadosNotificacao: null, valors: { "nome": "", "senha": "", "email": "" } }); // Passe erros ou null, dependendo do seu caso
});

router.get("/home", verificarUsuAutenticado, function (req, res) {
  res.render("pages/home", { produtos: results, paginador: paginador, autenticado: req.session.autenticado })
}
);

router.get("/login", verificarUsuAutenticado, function (req, res) {
  res.locals.erroLogin = null
  res.render("pages/login", { listaErros: null, dadosNotificacao: null });
}
);

router.get("/usuario", verificarUsuAutenticado, async function (req, res) {
  if (req.session.autenticado.autenticado == null) {
    res.redirect("/login")
  } else {
    res.render("pages/usuario", { autenticado: req.session.autenticado, retorno: null, erros: null })
  }
}

);


router.get("/user_dados2", function(req, res){
  res.render("pages/user_dados2", {autenticado: req.session.autenticado})
}
  
)


router.post("/perfil", upload.single('img_usuario'),
  // body("nome")
  //   .isLength({ min: 3, max: 50 }).withMessage("Mínimo de 3 letras e máximo de 50!"),
  // body("cpf")
  //   .isLength({ min: 8, max: 30 }).withMessage("8 a 30 caracteres!"),
  // body("email")
  //   .isEmail().withMessage("Digite um e-mail válido!"),
  // body("telefone")
  //   .isLength({ min: 12, max: 13 }).withMessage("Digite um telefone válido!"),
  // verificarUsuAutorizado([1, 2, 3], "pages/login"),
  async function (req, res) {
    const erros = validationResult(req);
    console.log(erros)
    if (!erros.isEmpty()) {
      return res.render("pages/usuario", { listaErros: erros, dadosNotificacao: null, valores: req.body, autenticado: req.body.autenticado})
    }
    try {
      var dadosForm = {
        nome: req.body.nome,
        email: req.body.email,
        cpf: req.body.cpf,
        telefone: req.body.telefone,
        img_usuario: req.body.img_usuario,
        id_tipo_usuario: 1
      };
      console.log("senha: " + req.body.senha)
      if (req.body.senha != "") {
        dadosForm.senha = bcrypt.hashSync(req.body.senha, salt);
      }
      if (!req.file) {
        console.log("Falha no carregamento");
      } else {
        caminhoArquivo = "img/produto/" + req.file.filename;
        dadosForm.img_usuario = caminhoArquivo
      }
      console.log(dadosForm);

      let resultUpdate = await usuarioDAL.update(dadosForm, req.session.autenticado.id);
      if (!resultUpdate.isEmpty) {
        if (resultUpdate.changedRows == 1) {
          var result = await usuarioDAL.findID(req.session.autenticado.id);
          var autenticado = {
            autenticado: result[0].nome,
            id: result[0].id,
            email: result[0].email,
            cpf: result[0].cpf,
            telefone: result[0].telefone,
            id_tipo_usuario: result[0].id_tipo_usuario,
            img_usuario: result[0].img_usuario
          };
          req.session.autenticado = autenticado;
          var campos = {
            autenticado: result[0].nome, email: result[0].email,
            img_usuario: result[0].img_usuario,
            cpf: result[0].cpf, telefone: result[0].telefone, senha: ""
          }
          res.render("pages/user_dados", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "", tipo: "success" }, autenticado: campos });
        }
      }
    } catch (e) {
      console.log(e)
      res.render("pages/user_dados", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, autenticado: req.body })
    }

  });

router.post("/perfil", upload.single('img_usuario'),
  // body("nome")
  //   .isLength({ min: 3, max: 50 }).withMessage("Mínimo de 3 letras e máximo de 50!"),
  // body("email")
  //   .isEmail().withMessage("Digite um e-mail válido!"),
  // body("cpf")
  //   .isLength({ min: 6, max: 20 }).withMessage("Cpf invalido"),
  // body("telefone")
  //   .isLength({ min: 6, max: 20 }).withMessage("Digite um telefone válido!"),
  // verificarUsuAutorizado([1, 2, 3], "pages/login"),
  async function (req, res) {
    const erros = validationResult(req);
    console.log(erros)
    if (!erros.isEmpty()) {
      return res.render("pages/login", { listaErros: erros, dadosNotificacao: null, valores: req.body })
    }
    try {
      var dadosForm = {
        nome: req.body.nome,
        email: req.body.email,
        id_tipo_usuario: 1,
        cpf: req.body.cpf,
        telefone: req.body.telefone,
        img_usuario: null
      };
      console.log("senha: " + req.body.senha)
      if (req.body.senha != "") {
        dadosForm.senha = bcrypt.hashSync(req.body.senha, salt);
      }
      if (!req.file) {
        console.log("Falha no carregamento");
      } else {
        caminhoArquivo = "img/perfil/" + req.file.filename;
        dadosForm.img_usuario = caminhoArquivo
      }
      console.log(dadosForm);
      console.log(autenticado);

      let resultUpdate = await usuarioDAL.update(dadosForm, req.session.autenticado.id);
      if (!resultUpdate.isEmpty) {
        if (resultUpdate.changedRows == 1) {
          var result = await usuarioDAL.findID(req.session.autenticado.id);
          var autenticado = {
            autenticado: result[0].nome,
            id: result[0].id,
            tipo: result[0].id_tipo_usuario,
            img_usuario: result[0].img_usuario
          };
          req.session.autenticado = autenticado;
          var campos = {
            nome: result[0].nome, email: result[0].email, img_usuario: result[0].img_usuario,
            cpf: result[0].cpf,
            telefone: result[0].telefone, senha: ""
          }
          res.render("pages/user_dados", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "", tipo: "success" }, valores: campos, autenticado: req.session.autenticado });
        }
      }
    } catch (e) {
      console.log(e)
      res.render("pages/user_dados", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body, autenticado: req.session.autenticado })
    }

  });

//   router.post("/attelefone",
//   async function (req, res) {
//     const erros = validationResult(req);
//     console.log(erros)
//     if (!erros.isEmpty()) {
//       return res.render("pages/login", { listaErros: erros, dadosNotificacao: null, valores: req.body })
//     }
//     try {
//       var dadosForm = {
//         telefone: req.body.telefone,
//       };
//       console.log(dadosForm);
  

//       let resultUpdate = await usuarioDAL.update(dadosForm, req.session.autenticado.id);
//       if (!resultUpdate.isEmpty) {
//         if (resultUpdate.changedRows == 1) {
//           var result = await usuarioDAL.findID(req.session.autenticado.id);
//           var campos = {
//             telefone: result[0].telefone
//           }
// res.redirect("/usuario")        }
//       }
//     } catch (e) {
//       console.log(e)
//       res.render("pages/user_dados", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body, autenticado: req.session.autenticado })
//     }

//   });

// router.post("/atcpf", 
//   body("cpf")
//   .isLength({ min: 6, max: 20 }).withMessage("Digite um CPF válido!"),
//   async function(req, res){
//   const erros = validationResult(req);
//   console.log(erros)
//   if (!erros.isEmpty()) {
//     return res.render("pages/user_dados", { listaErros: erros, dadosNotificacao: null, valores: req.body, autenticado: req.session.autenticado })
//   }
//   try {
//     var dadosForm = {
//       cpf: req.body.cpf
//     }
//     console.log(dadosForm)
//     let resultUpdate = await usuarioDAL.update(dadosForm, req.session.autenticado.id);
//     if (!resultUpdate.isEmpty) {
//       if (resultUpdate.changeRows == 1) {
//         var result = await usuarioDAL.findID(req.session.autenticado.id);
//         var autenticado = {
//           cpf: result[0].cpf
//         };
//         req.session.autenticado = autenticado;
//         var campos = {
//           cpf: result[0].cpf
//         }
//         // res.render("pages/user_dados", { listaErros: null, dadosNotificacao: { titulo: "CPF atualizado com sucesso!", mensagem: "", tipo: "success" }, valores: campos , autenticado: req.session.autenticado});

//       }
//     }
//   }catch (e) {
//     console.log(e)
//     // req.redirect("/")
//     // res.render("pages/user_dados", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body, autenticado: req.session.autenticado })
//   }
// })



// router.get("/usuario", verificarUsuAutenticado, function(req, res){
//     req.session.autenticado.login = req.query.login;
//     res.render("pages/usuario", {retorno: null, erros: null})}
// );

router.get("/notifi", function (req, res) {
  res.render("pages/notifi", { retorno: null, erros: null })
}
);

router.get("/compras", function (req, res) {
  res.render("pages/compras", { retorno: null, erros: null })
}
);


router.get("/config", function (req, res) {
  res.render("pages/config", { retorno: null, erros: null })
}
);

router.get("/adm", verificarUsuAutorizado([3], "pages/restrito"), async function (req, res) {
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
    res.render("pages/adm", { usuarios: results, paginador: paginador, autenticado: req.session.autenticado });
  } catch (e) {
    console.log(e); // console log the error so we can see it in the console
    res.json({ erro: "Falha ao acessar dados" });
  }


  //    res.render("pages/adm", {usuarios: results, retorno: null, erros: null, autenticado: req.session.autenticado})
});



router.get("/painelvendedor", verificarUsuAutorizado([2, 3], "pages/restrito"), async function (req, res) {
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
    res.render("pages/painelvendedor", { produtos: results, paginador: paginador, autenticado: req.session.autenticado, login: req.res.autenticado });
  } catch (e) {
    console.log(e); // console log the error so we can see it in the console
    res.json({ erro: "Falha ao acessar dados" });
  }


  //    res.render("pages/adm", {usuarios: results, retorno: null, erros: null, autenticado: req.session.autenticado})
});


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

router.get("/excluirusu/:id", function (req, res) {
  var query = db.query(
    "DELETE FROM usuarios WHERE ?",
    { id: req.params.id },
    function (error, results, fields) {
      if (error) throw error;
    }
  );
  res.redirect("/sair");
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

// router.get("/addfavorito/:id_produto", function (req, res){
//   try {

//   }catch{
    
//   }
// })

 router.get("/addfavorito/:id_produto/:id", function (req, res){
   var query = db.query (
     "insert into favoritos set ?",
     {id_produto: req.params.id_produto,
     id_usuario: req.params.id
     },
     function (error, results, fields) {
       if (error) throw error;
     }
   )
   res.redirect("/");
 })


router.get('/favoritos/:id', verificarUsuAutenticado,(req, res) => {
  const id_usuario = req.params.id; // Supondo que o ID do usuário está na sessão
  console.log('ID do usuário logado:', id_usuario);
  const sql = 'SELECT id_produto FROM favoritos WHERE id_usuario = ?';
  
  db.query(sql, id_usuario, (err, result) => {
    if (err) {
      res.status(500).send('Erro ao buscar favoritos');
    } else {
      const produtosFavoritados = result.map(row => row.id_produto);
      const queryProdutos = 'SELECT * FROM produtos WHERE id_produto IN (?)';
      
      db.query(queryProdutos, [produtosFavoritados], (err, result) => {
        if (err) {
          res.status(500).send('Erro ao buscar detalhes dos produtos favoritados');
        } else {
          res.render('pages/favoritos', { produtos: result });
        }
      });
    }
  });
});



// router.post("/addfavorito/:id_produto",function(req, res){
//   var produtoFav = {
//     id_usuario: req.session.id,
//     id_produto: req.query.id_produto
//   }
//   const erros = validationResult(req);
//     if (!erros.isEmpty()) {
//       return res.render("pages/home", { listaErros: erros, dadosNotificacao: null, valores: req.body, autenticado: req.session.autenticado })
//     }
// })

router.get("/cartao", function (req, res) {
  res.render("pages/cartao", { retorno: null, erros: null })
});

router.get("/carrinho", function (req, res) {
  res.render("pages/carrinho", { retorno: null, erros: null })
});

router.get("/historico", function (req, res) {
  res.render("pages/historico", { retorno: null, erros: null })
});

router.get("/dados", function (req, res) {
  res.render("pages/dados", { retorno: null, erros: null })
});



router.get("/anunciar", function (req, res) {
  res.render("pages/anunciar", { listaErros: null, dadosNotificacao: null })
});

router.get("/pagaconcluido", function (req, res) {
  res.render("pages/pagaconcluido", { retorno: null, erros: null })
});

router.get("/pagacancelado", function (req, res) {
  res.render("pages/pagacancelado", { retorno: null, erros: null })
});

router.get("/addprod", function (req, res) {
  res.render("pages/addprod", { retorno: null, erros: null })
});

router.get("/formenviado", function (req, res) {
  res.render("pages/formenviado", { retorno: null, erros: null })
}
);
router.get("/politica", function (req, res) {
  res.render("pages/politica", { retorno: null, erros: null })
}
);
router.get("/termos", function (req, res) {
  res.render("pages/termos", { retorno: null, erros: null })
}
);
router.get("/contato", function (req, res) {
  res.render("pages/contato", { retorno: null, erros: null })
}
);
router.get("/comunicacao", function (req, res) {
  res.render("pages/comunicacao", { retorno: null, erros: null })
}
);

router.get("/user_dados", async function (req, res) {
  res.render("pages/user_dados", { retorno: null, erros: null, autenticado: req.session.autenticado })
}
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
  async function (req, res) {
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