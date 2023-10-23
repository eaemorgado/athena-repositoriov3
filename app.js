const express = require("express");
const app = express();
const port = 2022
const flash  =require("express-flash")

var session = require("express-session");

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");


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