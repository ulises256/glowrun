var db = require('../relaciones');
var passport = require('passport'); //Agregamos el passport
var jwt = require('jsonwebtoken'); //Agregamos jsonwebtoken
var localStrategy = require('passport-local').Strategy; //Agregamos el tipo de estrategia
var facebookStrategy = require('passport-facebook').Strategy; //Agregamos facebook
var twitterStrategy = require('passport-twitter').Strategy; //estraeia de twitter
var googleStrategy = require('passport-google-oauth20').Strategy; //estrategia de google
var instagramStrategy = require('passport-instagram').Strategy;
var config = require('../../conf/oauth.js')

var usuario = db.usuario;
var avatar = db.avatar;
var carrera = db.carrera;
var llaveSocial = db.llaveSocial;
var orden = db.orden;
var secret = 'lazukulencia'; //creamos una variable para el token

var ex = module.exports = {};

passport.serializeUser(function(user, done) {

    var serializeData = {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo
    };

    done(null, serializeData);

});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

ex.create = function(req, res, next) {

    var data = req.body;

    usuario.create(data).then(result  => {
        res.status(200).jsonp(result);
    });

};

ex.delete = function(req, res, next) {
    var id = req.params.id;
    usuario.findById(id).then(function(usuario) {
        usuario.destroy().then(function(result) {
            res.status(200).jsonp(result);
        });
    });
};

ex.update = function(req, res, next) {
    var id = req.params.id;
    var data = req.body;

    usuario.update(data, {
        where: {
            id: id
        }
    }).then(function(result) {
        res.status(200).jsonp({msj: 'SUCCESS!'});
    });
};

ex.read = function(req, res, next) {

    var id = req.params.id;

    if (id) {
        usuario.findById(id, {
			include : [
				{ model: avatar }
			]
		}).then(function(usuario) {
            res.status(200).jsonp(usuario);
        });
    } else {
        usuario.findAll().then(function(usuarios) {
            res.status(200).jsonp(usuarios);
        });
    }
};

ex.login = function(req, res, next) {

    var data = req.body;
    // console.log(req.body);

    passport.authenticate('login', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send({success: false, message: 'Incorrect username or password.'});
        }

        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            var token = jwt.sign({
                user: user
            }, secret, {expiresIn: '24h'});
            return res.send({success: true, message: 'Authentication succeeded', token: token});
        });
    })(req, res, next);

};

ex.token = function(req, res, next) {
    var token = req.params.token;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            res.send({success: false, message: 'token invlid'})
        } else {
            res.json(decoded)
        }
    });
}

ex.registro = function(req, res, next) {

    var data = req.body;
    console.log(data)

    passport.authenticate('registro', function(err, user, info) {
        if (err) {
            console.log(err)
            return next(err);
        }
        if (!user) {
            return res.send({success: false, message: info});
        }

        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            var token = jwt.sign({
                user: user
            }, secret, {expiresIn: '24h'});
            return res.send({success: true, message: 'Authentication succeeded', token: token});
        });
    })(req, res, next);

};

passport.use('login', new localStrategy({

    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true

}, function(req, username, password, done) {
    usuario.findOne({
        include : [
            { model: avatar }
        ],
        where: {
            'correo': username
        }
    }).then(function(user) {
        if (user == null) {
            return done(null, false)
            console.log('no se encontro un usuario');
        }
        if (password == user.password) {
            return done(null, user)
        }
        return done(null, false)
    })
}))

passport.use('registro', new localStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done) {

    console.log('esta sucediendo algo')

    usuario.find({
        include : [
            { model: avatar }
        ],
        where: {
            'correo': username
        }
    }).then(function(user) {
        console.log(user)
        if (user) {
            return done(null, false);
        } else {

            var data = req.body;
            usuario.create(data).then(function(user) {
                avatar_fb = 'assets/images/perfil.png'
                avatar.create({ id_usuario : user.id, fb_avatar: avatar_fb })
                return done(null, user);

            }, function(err) {
                throw err;
            });
        }
    }, function(err) {
        done(err, null);
    });
}));

ex.twitter = (req, res, next) =>  passport.authenticate('twitter', {scope: ['email', 'user_location']})(req, res, next);

ex.twittercallback = (req, res, next) => passport.authenticate('twitter', { successRedirect: '/token', failureRedirect: '/'})(req, res, next);

passport.use('twitter', new twitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL,
    includeEmail: true
  },
  function(token, tokenSecret, profile, done) {

    process.nextTick(()  => {
        socializar('tw_id', 'fb_avatar' ,profile, done)
    });
    
  }
));

ex.facebook = (req, res, next) => passport.authenticate('facebook', {scope: ['email', 'user_location']})(req, res, next);

ex.facebookcallback = (req, res, next) => passport.authenticate('facebook', { successRedirect: '/token', failureRedirect: '/'})(req, res, next);


passport.use('facebook', new facebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: [
        'id',
        'emails',
        'displayName',
        'picture',
        'cover',
        'first_name',
        'last_name',
        'locale',
        'gender',
        'hometown'
    ]
}, function(accessToken, refreshToken, profile, done) {
    profile.photos != undefined ? avatar_fb = profile.photos[0].value : avatar_fb = 'assets/images/perfil.png'
    process.nextTick(() => {
        socializar('fb_id', 'fb_avatar' ,profile, done)

    });
}));


ex.instagram = (req, res, next) =>  passport.authenticate('instagram',  { scope: ['basic', 'public_content', 'follower_list', 'comments', 'relationships', 'likes'] })(req, res, next);

ex.instagramcallback = (req, res, next) => passport.authenticate('instagram', { successRedirect: '/token', failureRedirect: '/'})(req, res, next);

passport.use('instagram', new instagramStrategy({
    clientID: config.instagram.clientID,
    clientSecret: config.instagram.clientSecret,
    callbackURL: config.instagram.callbackURL,
  },
  function(token, tokenSecret, profile, done) {

    process.nextTick(()  => {
        socializar('inst_id', 'fb_avatar' ,profile, done)
    });
    
  }
));

ex.google = (req, res, next) =>  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] })(req, res, next);

ex.googlecallback = (req, res, next) => passport.authenticate('google', { successRedirect: '/token', failureRedirect: '/'})(req, res, next);

passport.use('google', new googleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile)
    process.nextTick(()  => {
        socializar('gl_id', 'fb_avatar' ,profile, done)
    });
    
  }
));

ex.avatar = function(req, res, next) {

    usuario.findById(req.params.id)
    .then(user => user ? user.getSocialKey().then(key => key.getAvatar().then(avatari => res.status(200).jsonp(avatari))) : res.status(200).jsonp());
};

ex.obtenerCarreras = (req, res, next) => usuario.findById(req.params.id)
    .then(usuario => usuario.getCarreras({attributes: ['id', 'municipio']}))
    .then(carreras => res.status(200).jsonp(carreras))
    .catch(err => res.status(500).jsonp(err))

ex.unirCarrera = (req, res, next) => usuario.findById(req.params.id)
    .then(usuario => usuario.addCarreras(req.body.id)
                    .then(carreras => _.flatten(carreras))
                    .then(carreras => carreras.map(n => new Object({id: n.id_carrera})))
                    .then(carreras => carrera.findById(carreras[0].id).then(carrer => res.status(200).jsonp(carrer)))
                    .catch(err => res.status(500).jsonp(err))    
    );    


function socializar(red_id, avatar_id, profile, done) {
    console.log(profile)
    if(red_id == 'inst_id')
        profile._json.data.profile_picture ? avatar_image = profile._json.data.profile_picture : avatar_image = 'assets/images/perfil.png'
    else
        profile.photos != undefined ? avatar_image = profile.photos[0].value : avatar_image = 'assets/images/perfil.png'
    llaveSocial.find({
        where: {
            [ red_id ] : profile.id
        }
    })
        .then(SocialKey => {
            if (SocialKey) {
                SocialKey.getAvatar().then(avatari => avatari ? avatari.update({ [avatar_id]: avatar_image }) : SocialKey.createAvatar({ [avatar_id]: avatar_image }))
                SocialKey.getUsuario().then(user => user.update({ nombre: profile.displayName })).then(user => done(null, user))
            } else {
                usuario.find({
                    where: {
                        correo: profile.emails[0].value
                    }
                })
                    .then(user => {
                        if (user) {
                            user.getSocialKey()
                                .then(key => key ?
                                    (
                                        key.getAvatar()
                                            .then(avatari => avatari ? avatari.update({ [avatar_id]: avatar_image }) : key.createAvatar({ [avatar_id]: avatar_image })),
                                        key.update({ [ red_id ]: profile.id }),
                                        done(null, user)
                                    )
                                    :
                                    (
                                        user.createSocialKey({ [ red_id ] : profile.id })
                                            .then(keysito => keysito.getAvatar()
                                                    .then(avatari => avatari ? avatari.update({ [avatar_id]: avatar_image }) : keysito.createAvatar({ [avatar_id]: avatar_image })))
                                            .then(nada => done(null, user))
                                    )
                                )
                        } else {
                            usuario.create({
                                nombre: profile.displayName,
                                correo: profile.emails[0].value,
                                sexo: profile.gender,
                            })
                                .then(useri => useri.createSocialKey({ [ red_id ] : profile.id })
                                    .then(keysito => {
                                        keysito.getAvatar()
                                            .then(avatari => avatari ? avatari.update({ [avatar_id]: avatar_image }) : keysito.createAvatar({ [avatar_id]: avatar_image }))
                                        done(null, useri)
                                    })
                                );
                        }
                    })
            }
        },
            function (err) {
                return done(err);
            })
}