module.exports = ({Sequelize, sequelize } = conector) =>
    sequelize.define('carreras', {
        nombre: Sequelize.STRING,
        fechaini: Sequelize.DATE,
        description: Sequelize.TEXT,
        status:  {
            type: Sequelize.ENUM,
            values: [ 'proximo', 'realizado' ],
            defaultValue: 'No'
        },
        videoUrl: Sequelize.STRING
    },{
    	name : {
    		singular: 'carrera',
    		plural: 'carreras'
        }
	})

