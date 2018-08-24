module.exports = ({Sequelize, sequelize } = conector) =>
    sequelize.define('cupones', {
        codigo: Sequelize.INTEGER,
        precio: Sequelize.FLOAT,
        status:  {
            type: Sequelize.ENUM,
            values: [ 'normal', 'vencido' ],
            defaultValue: 'normal',
        },
    },{
    	name : {
    		singular: 'orden',
    		plural: 'ordenes'
        }
	})
