const {Router} = require('express');
const {postUsuario, putPassword, activarUsuario} = require('../controllers/usuariosController');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validarCampos');
const {validarJWT} = require('../middlewares/validarJWT')

const router = Router();

router.post('/', [
    check('nombre','El campo es obligatorio').trim().not().isEmpty().escape(),
    check('apellidop','El apellido paterno es obligatorio').trim().not().isEmpty().escape(),
    check('email','El correo es obligatorio').trim().not().isEmpty().isEmail().normalizeEmail(),
    check('negocio','El nombre del negocio es obligatorio').trim().not().isEmpty().escape(),
    check('password','La contraseña es obligatoria').trim().not().isEmpty().escape(),
    check('password','La contraseña necesita minimo 6 caracteres').isLength({min: 6}),
    validarCampos
],postUsuario);

router.put('/password/:id', [
    validarJWT,
    check('passwordOld','La contraseña actual es obligatoria').trim().not().isEmpty().escape(),
    check('password','El la nueva contraseña es obligatoria').trim().not().isEmpty().escape(),
    check('password','La contraseña necesita minimo 6 caracteres').isLength({min: 6}),
    validarCampos
],putPassword)

router.get('/activate/:token',[
    check('token').trim().not().isEmpty().escape(),
    check('token','El formato del codigo de acitvacion es invalido').isLength({min: 6, max: 6}),
    validarCampos
] ,activarUsuario);


module.exports = router;