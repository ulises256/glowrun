const db = require('../relaciones');
var { orden } = db;
var isProduction = false;
var resource_name = 'https://sandbox-api.openpay.mx'
//class
var Openpay = require('openpay');
//instantiation
var openpay = new Openpay('m6guc0dqh2k6d0vvqdgx', 'sk_a01368db5be24c55b0e8b0dab5c71fe8', [ isProduction ]);

openpay.setMerchantId('m6guc0dqh2k6d0vvqdgx');
openpay.setPrivateKey('sk_a01368db5be24c55b0e8b0dab5c71fe8');
openpay.setProductionReady(false);
//use the api

var ex = module.exports = {};

ex.create = (req, res, next) => orden.create(req.body).then(response => res.status(200).jsonp(response))


ex.crearTransaccionPagar = (req, res, next) => 
    openpay.charges.create(req.body, function (error, body){
            console.log(body)
            console.log(error)
          });




//     console.log(req.body)

//     var newCharge = {
//         "method": "card",
//         "customer":{
//             "name": "John Doe",
//             "email": "luisgateshouse@gmail.com"
//         },
//         "amount" : 200.00,
//         "description" : "Service Charge",
//         "order_id" : "oid-00721",
//         "device_session_id": req.body.deviceSessionId,
//         "source_id" : req.body.idTarjeta
//       };    
//     openpay.charges.create(newCharge, function (error, body){
//         console.log(body)
//         console.log(error)
//       });
// }


ex.delete = (req, res, next) => orden.findById(req.params.id)
    .then(orden => orden.destroy())
    .then(response => res.status(200).jsonp(response))

ex.update = (req, res, next) => orden.update(req.body, { where: { id: req.params.id } } )
    .then(response => res.status(200).jsonp(response))

ex.read =  (req, res, next) => req.params.id ?
    orden.findById(req.params.id)
    .then(response => res.status(200).jsonp(response))
    :
    orden.findAll()
    .then(response => res.status(200).jsonp(response))

ex.obtenerUsuario = (req, res, next) => orden.findById(req.params.id)
    .then(orden => orden.getUsuario())
    .then(response => res.status(200).jsonp(response))
