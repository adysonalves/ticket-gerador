const {Sequelize, sequelize} = require('../database/bd');

const Usuario = sequelize.define('usuario', {
    username:{
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo_user:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},{
    timestamps: false
});


module.exports = Usuario;