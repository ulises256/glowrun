module.exports = ({Sequelize, sequelize } = conector) =>
    sequelize.define('carreras', {
        nombre: Sequelize.STRING,
        fechaini: Sequelize.DATE,
        description: Sequelize.TEXT
    },{
    	name : {
    		singular: 'carrera',
    		plural: 'carreras'
        }
	})

