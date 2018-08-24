module.exports = ({Sequelize, sequelize } = conector) =>
    sequelize.define('estados', {
        estado: Sequelize.STRING,
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        } 
    },{
    	name : {
    		singular: 'estado',
    		plural: 'estados'
        }
	})

