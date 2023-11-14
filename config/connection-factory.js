var mysql = require("mysql2")

//  module.exports = function () {
//      return mysql.createConnection({
//          host: "localhost",
//         user: "root",
//          password: "@ITB123456",
//          database: "athenashop",
//          port: "3306"
//      });

//  };


 // Banco de dados do servidor

 module.exports = function(){
     return mysql.createConnection({
        host: "monorail.proxy.rlwy.net",
         user: "root",
         password: "aEg3e4HcD5B14bA3bHAGF6254A5g-Cdc",
         database: "railway",
         port: "34180"
     });

 };
