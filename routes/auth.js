const {Router} = require('express');
const { singin, renovarToken } = require('../controllers/authController');
const {check} = require('express-validator');
const {validarJWT} = require('../middlewares/validarJWT');
const {validarCampos} = require('../middlewares/validarCampos');

const router = Router();

router.post('/singin',[
    check('email','El correo es obligatorio').trim().not().isEmpty().isEmail().normalizeEmail(),
    check('password','La contraseña es obligatoria').trim().not().isEmpty().escape(),
    validarCampos
] ,singin)

router.get('/token',[
    validarJWT,
    validarCampos
] ,renovarToken)

module.exports = router;