const {Sequelize, sequelize} = require('../database/bd');

const Instalar = sequelize.define('status_config', {
    situacao:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    timestamps: false
}
)

module.exports = Instalar