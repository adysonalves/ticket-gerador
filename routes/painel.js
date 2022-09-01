const express = require('express');
const Ticket = require('../models/Ticket');
const Tipo = require('../models/Tipo');
const Usuario = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const router = express.Router()

router.get('/', (req, res) => {
    if (req.session.userType == 1) {

        res.status(200).render('painel', {
            title: 'Painel',
            css: 'estilo2',
            type_admin: true
        })

    }

    if (req.session.userType == 2) {
        res.status(200).render('painel', {
            title: 'Painel',
            css: 'estilo2',
            type_operador: true
        })
    }

    if (req.session.userType == 3) {
        res.status(200).render('painel', {
            title: 'Painel',
            css: 'estilo2',
            type_validador: true
        })
    }



});

router.get('/cadastrar-tipo', async (req, res) => {

    if (req.session.userType != 1) {
        return res.redirect('/painel');
    }

    await Tipo.findAll().then(dados => {
        if (dados.length > 0) {
            res.render('tipos', {
                title: 'Tipos de tickets',
                css: 'estilo2',
                table: true,
                dados: dados.map(dados => dados.toJSON()),
                mensagem: req.flash('mensagem'),
                classAlert: 'success'
            })
        } else {
            res.render('tipos', {
                title: 'Tipos de tickets',
                css: 'estilo2',
                table: false,
                mensagem: req.flash('mensagem'),
                classAlert: 'success'
            })
        }


    })

});


router.get('/novo-ticket', async (req, res) => {
    if (req.session.userType != 1 && req.session.userType != 2) {
        return res.redirect('/painel');
    }
    await Tipo.findAll().then(dados => {
        if (dados.length > 0) {
            res.render('tickets', {
                title: 'Novo ticket',
                css: 'estilo2',
                dados: dados.map(dados => dados.toJSON())
            })
        } else {
            res.render('tickets', {
                title: 'Novo ticket',
                css: 'estilo2'
            })
        }
    })
});

router.get('/estornar-ticket', async (req, res) => {

    if (req.session.userType != 1 && req.session.userType != 2) {
        return res.redirect('/painel');
    }

    await Usuario.findAll({
        where: {
            tipo_user: 1
        }
    }).then(users => {
        res.render('estorna-ticket', {
            title: 'Estornar ticket',
            css: 'estilo2',
            users: users.map(users => users.toJSON()),
            mensagem: req.flash('mensagem'),
            classAlert: 'info'
        })
    })


})

router.get('/validador', (req, res) => {

    res.render('validador', {
        title: 'Validar ticket',
        css: 'estilo2'
    })
});

router.get('/usuarios', async (req, res) => {
    if (req.session.userType != 1) {
        return res.redirect('/painel');
    }
    await Usuario.findAll().then(dados => {
        if (dados.length > 0) {

            res.render('usuarios', {
                title: 'Usuários',
                css: 'estilo2',
                dados: dados.map(dados => dados.toJSON()),
                table: true,
                mensagem: req.flash('mensagem'),
                classAlert: 'success'
            })

        } else {
            res.render('usuarios', {
                title: 'Usuários',
                css: 'estilo2',
                table: false,
                mensagem: req.flash('mensagem'),
                classAlert: 'success'
            })
        }
    })

})

// ROTAS POST



router.post('/add-user', async (req, res) => {
    let encryptSenha = await bcrypt.hash(req.body.senha, 10);
    await Usuario.create({
        nome: req.body.nome,
        username: req.body.username,
        senha: encryptSenha,
        tipo_user: req.body.tipo_user
    }).then(sucess => {
        req.flash('mensagem','Usuário adicionado com sucesso!')
        return res.redirect('/painel/usuarios');
    })
});

router.post('/del-user', async (req, res) => {
    await Usuario.destroy({
        where: {
            id: req.body.id
        }
    }).then(success => {
        req.flash('mensagem','Usuário excluído com sucesso!')
        return res.redirect('/painel/usuarios');
    })
})

router.post('/edit-user', async (req, res) => {
    await Usuario.findByPk(req.body.id).then(dados => {
        res.render('editar-usuario', {
            title: 'Editando usuário',
            css: 'estilo2',
            id: dados.id,
            username: dados.username,
            tipo_user: dados.tipo_user
        })
    })
});

router.post('/update-user', async (req, res) => {
    let encryptSenha = await bcrypt.hash(req.body.senha, 10)
    await Usuario.update({
        username: req.body.username,
        senha: encryptSenha,
        tipo_user: req.body.tipo_user
    },
        {
            where: {
                id: req.body.id
            }
        }
    ).then(sucess => {
        req.flash('mensagem','Usuário atualizado com sucesso!')
        return res.redirect('/painel/usuarios');
    }).catch(err => {
        console.log('Falha ao atualizar registro: ' + err);
        req.flash('mensagem','Não foi possível atualizar o usuário.')
        return res.redirect('/painel/usuarios');
    })
})

router.post('/add-tipo', async (req, res) => {
    const erros = [];

    let evento = req.body.evento;
    let valor = req.body.valor;

    evento = evento.trim();
    evento = evento.toUpperCase();

    valor = valor.trim();
    valor = valor.replace(',','.');

    if(!evento || typeof evento == undefined || evento == null){
        erros.push({"mensagem":"Nome do evento não pode ser vazio"})
    }

    if(!valor || typeof valor == undefined || valor == null){
        erros.push({'mensagem':'Valor do evento não pode ser vazio!'})
    }

    if(erros.length > 0){
        return res.render('tipos',{
            title: 'Eventos',
            css:'estilo2',
            erros: erros
        })
    }



    await Tipo.create({
        evento: evento,
        valor: valor
    }).then(success => {
        req.flash('mensagem', 'Novo evento adicionado com sucesso!')
        return res.redirect('/painel/cadastrar-tipo');
    }).catch(err => {
        console.log('Falha ao criar novo tipo: ' + err)
    })
});

router.post('/del-evento', async (req, res) => {
    await Tipo.destroy({
        where: {
            id: req.body.id
        }
    }).then(success => {
        req.flash('mensagem', 'Evento excluído com sucesso!')
        return res.redirect('/painel/cadastrar-tipo')
    }).catch(err => {
        console.log(err)
        return res.redirect('/painel/cadastrar-tipo')
    })
});

router.post('/edit-evento', async (req, res) => {
    await Tipo.findByPk(req.body.id).then(evento => {
        res.render('editar-eventos', {
            title: 'Editando evento',
            css: 'estilo2',
            id: evento.id,
            evento: evento.evento,
            valor: evento.valor
        });
    })
});

router.post('/editar-evento', async (req, res) => {
    await Tipo.update({
        evento: req.body.evento,
        valor: req.body.valor
    },
        {
            where: {
                id: req.body.id
            }
        }
    ).then(success => {
        req.flash('mensagem', 'Evento alterado com sucesso!')
        return res.redirect('/painel/cadastrar-tipo')
    }).catch(err => {
        console.log('Falha ao atualizar registro: ' + err);
        return res.redirect('/painel/cadastrar-tipo')
    })
});

router.post('/new-ticket', async (req, res) => {
    let evento = req.body.evento;
    let codigo = evento + Math.floor(Math.random() * 100000)

    await Ticket.create({
        codigo: codigo,
        evento: evento
    }).then(sucess => {
        Tipo.findByPk(evento).then(dados => {
            res.render('imprimir-ticket', {
                title: 'Impressão de ticket',
                css: 'estilo3',
                codigo: codigo,
                evento: dados.evento,
                valor_ingresso: dados.valor
            })
        })

    }).catch(err => {
        console.log('Erro ao criar ticket: ' + err)
        return res.redirect('/painel')
    })
});

router.post('/estornar-ticket', async (req, res) => {
    await Ticket.findOne({
        where: {
            codigo: req.body.codigo
        }
    }).then(async (ticket) => {
        await Usuario.findAll({
            where: {
                tipo_user: 1
            }
        }).then(users => {
            res.render('estorna-ticket', {
                title: 'Estornar ticket',
                css: 'estilo2',
                codigo_ticket: ticket.codigo,
                users: users.map(users => users.toJSON())
                
            })
        })

    })
})

router.post('/del-ticket', async (req, res) => {
    let codigoTicket = req.body.codigo;
    await Usuario.findByPk(req.body.id).then(async (user) => {
        if (await bcrypt.compare(req.body.senha, user.senha)) {
            await Ticket.findOne({
                    where: {
                        codigo: codigoTicket
                    }
                }).then(ticket => {
                    if (ticket != null) {
                        Ticket.destroy({
                            where: {
                                codigo: req.body.codigo
                            }
                        })
                        req.flash('mensagem', `Ticket: ${codigoTicket}, foi estornado com sucesso!`)
                        return res.redirect('/painel/estornar-ticket')
                    } else {
                        req.flash('mensagem', `Ticket não encontrado!`)
                        return res.redirect('/painel/estornar-ticket')
                    }
                })




        } else {
            req.flash('mensagem', `Senha do administrador é inválida!`)
            return res.redirect('/painel/estornar-ticket')
        }

        // return res.redirect('/painel')


    })
})

router.post('/validador', async (req, res) => {
    await Ticket.findOne({
        where: {
            codigo: req.body.ticket
        }
    }).then(ticket => {
        if (ticket != null && ticket.validador == 1) {
            Ticket.update({
                validador: 0
            },
                {
                    where: {
                        codigo: ticket.codigo
                    }
                }
            );

            Tipo.findOne({
                where: {
                    id: ticket.evento
                }
            }).then(evento => {

                return res.render('ticket-validado', {
                    title: 'Ticket validado',
                    css: 'estilo3',
                    codigo: ticket.codigo,
                    evento: evento.evento

                })

            })

        } else{
            return res.render('ticket-invalido', {
                title: 'Ticket inválido',
                css: 'estilo3',
                codigo: req.body.ticket

            })
        }
            
        
    })
})



module.exports = router;