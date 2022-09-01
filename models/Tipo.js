const {Sequelize, sequelize} = require('../database/bd');
const Ticket = require('./Ticket');

const Tipo = sequelize.define('tipos_tickets',{
    evento:{
        type: Sequelize.STRING,
        allowNull: false
    },
    valor:{
        type: Sequelize.DECIMAL(8,2),
        allowNull: false
    }
},
{
    timestamps: false
}
);


module.exports = Tipo;