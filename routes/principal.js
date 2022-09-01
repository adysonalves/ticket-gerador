const express = require('express');
const Usuario = require('../models/Usuarios');
const { route } = require('./painel');
const router = express.Router();
const bcrypt = require('bcrypt');
const Instalar = require('../models/Instalar');

router.get('/', async(req,res) => {
    if(req.session.logado){
        return res.redirect('/painel')
    }

    await Instalar.findAll().then(async(dados) => {
        if(dados.length > 0){
            res.status(200).render('index', {
                title: 'Entrar no sistema',
                css: 'estilo',
                mensagem: req.flash('mensagem'),
                classAlert: 'danger'
            })
            
        } else{
            await Instalar.create({
                situacao: 1
            }).then(async(success) => {
                let encryptSenha = await bcrypt.hash('root',10)
                await Usuario.create({
                    username: 'root',
                    senha: encryptSenha,
                    tipo_user: 1
                }).then(success => {
                    return res.redirect('/')
                })
            })
        }

        
    })

    
})

router.post('/', async(req,res) => {
    const erros = []

    let username = req.body.username
    let senha = req.body.senha

    username = username.trim();
    username = username.toLowerCase()

    if(!username || typeof username == undefined || username == null){
        erros.push({'mensagem':'Username não pode ser vazio!'})
    }

    if(!senha || typeof senha == undefined || senha == null){
        erros.push({'mensagem':'Senha não pode ser vazia!'})
    }

    if(erros.length > 0){
        res.render('index', {
            title: 'Entrar no sistema',
            css: 'estilo',
            erros: erros
        })
    } else {
        await Usuario.findOne({
            where:{
                username: username
            }
        }).then( async(user) => {
            
            if(user != null && await bcrypt.compare(senha, user.senha)){
                req.session.userType = user.tipo_user;
                req.session.logado = true;
                req.session.idUser = user.id
                return res.redirect('/painel')
            } 
                req.session.logado = false;
                req.flash('mensagem','Usuário ou senha invalidos!')
                return res.redirect('/');
            
        })

    }

})

router.get('/logout', (req,res) => {
    req.session.logado = false;
    req.session.userType = '';
    req.session.idUser = '';
    return res.redirect('/');
})


module.exports = router