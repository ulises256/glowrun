var route = require('express').Router();
var x = require('../controladores/Orden');

route.route('/data/orden')
        .get(x.read)
        .post(x.create);

route.route('/data/orden/:id')
        .get(x.read)
        .put(x.update)
        .delete(x.delete);

route.route('/data/orden/usuario/:id')
        .get(x.obtenerUsuario);
module.exports = route;

