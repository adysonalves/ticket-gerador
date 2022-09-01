const {Sequelize, sequelize} = require('../database/bd');
const Tipo = require('./Tipo');

const Ticket = sequelize.define('ticket',{
    codigo:{
        type: Sequelize.STRING(7),
        allowNull: false,
        unique: true
    },
    validador:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }

}
);


Tipo.hasOne(Ticket, {
    foreignKey: 'evento'
})

Ticket.belongsTo(Tipo, {
    constraint: true,
    foreignKey:{
        name: 'evento',
        allowNull: false
    }
});

module.exports = Ticket;