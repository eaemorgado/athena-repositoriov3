var mysql = require("mysql2")
// const config_server = require("config/config.js");

// module.exports = function(){
//     return mysql.createConnection({
//         host:   "viaduct.proxy.rlwy.net",
//         user:   "root",
//         password:   "c1D5BfbbgEh54Faa6bhEbd45GC5D3CGf",
//         database:   "railway",
//         port:   "33808"
//     });

// };

module.exports = function () {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "@ITB123456",
        database: "athenashop",
        port: "3306"
    });

};

// module.exports = function(){
    // return mysql.createConnection({
    //     host:   "127.0.0.1",
    //     user:   "root",
    //     password:   "",
    //     database:   "athenashop",
    //     port:   "3306"
//     });

// };

