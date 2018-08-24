var route = require('express').Router();
var x = require('../controladores/Cupon');

route.route('/data/cupon')
        .get(x.read)
        .post(x.create);

route.route('/data/cupon/:id')
        .get(x.read)
        .put(x.update)
        .delete(x.delete);

module.exports = route;    