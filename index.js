require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const flash = require('connect-flash')

// SESSION
const session = require('express-session')
app.use(session({
    secret: 'AHSJDKKFLOOERM256323@FDDKFKDHUHNDSGSH',
    resave: false,
    saveUninitialized: true
}));
app.use(flash())

// HANDLEBARS
const hbs = require('express-handlebars');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main'
})); app.set('view engine', 'hbs');

// CONEXÃO AO BANCO DE DADOS
const {Sequelize, sequelize} = require('./database/bd');

// MODELS BD
const Usuarios = require('./models/Usuarios');
const Ticket = require('./models/Ticket');
const Tipo = require('./models/Tipo');
const Instalar = require('./models/Instalar');

//SYNC BD
sequelize.sync()


// CONFIGS
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));


// ROTAS EXPOSTADAS
const principal = require('./routes/principal');
const painel = require('./routes/painel');


// MIDDLEWARES

app.use('/painel', (req,res,next) => {
    if(!req.session.logado){
        return res.redirect('/')
    }
    next()
})

//ROTAS
app.use('/', principal);
app.use('/painel', painel);

app.listen(PORT, () => {
    console.log('Servidor Rodando...');
});