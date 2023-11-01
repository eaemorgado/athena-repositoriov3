const express = require("express");
const app = express();
const port = 2022
const flash  =require("express-flash")

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");



var session = require("express-session");

app.use(express.urlencoded({ extended: true }));

// Configura a sessão
app.use(session({
  secret: 'athenashop',
  resave: true,
  saveUninitialized: true
}));


var rotas   = require("./app/routes/router");
app.use("/", rotas);

app.listen(port, () =>{
    console.log(`O site esta online`)
});