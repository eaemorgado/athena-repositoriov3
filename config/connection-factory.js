var mysql = require("mysql");
// const config_server = require("config/config.js");

module.exports = function(){
    return mysql.createConnection({
        host:   "127.0.0.1",
        user:   "root",
        password:   "",
        database:   "athenashop",
        port:   "3306"
    });

};