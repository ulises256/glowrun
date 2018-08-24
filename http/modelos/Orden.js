module.exports = ({Sequelize, sequelize } = conector) =>
    sequelize.define('ordenes', {
        nombre: Sequelize.STRING,
        status:  {
            type: Sequelize.ENUM,
            values: [ 'completed', 'pendiente' ],
            defaultValue: 'pendiente',
        },
        fechaCompra: Sequelize.DATE,
        precio: Sequelize.FLOAT
    },{
    	name : {
    		singular: 'orden',
    		plural: 'ordenes'
        }
	})

