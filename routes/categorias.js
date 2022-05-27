const {Router} = require('express');
const {getCategorias, getCategoriaId, deleteCategoria, postCategoria, putCategoria, getCategoriasAll} = require('../controllers/categoriasController');
const {validarJWT} = require('../middlewares/validarJWT');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validarCampos');

const router = Router();

router.get('/',[
    check('negocio','El negocio es obligatorio').not().isEmpty().trim().escape(),
    validarCampos
] ,getCategorias);

router.get('/all',[
    check('negocio','El negocio es obligatorio').not().isEmpty().trim().escape(),
    validarCampos
] ,getCategoriasAll);

router.get('/:id', [
    check('id', 'El identificador de la categoria es invalido').not().isEmpty().isNumeric(),
    validarCampos
] , getCategoriaId)

router.delete('/:id', [
    validarJWT,
    check('id', 'El formato del identificador de la categoria es invalido.').not().isEmpty().isNumeric(),
    validarCampos
] , deleteCategoria)

router.post('/', [
    validarJWT,
    check('nombre','El nombre de la categoria es obligatorio').not().isEmpty().trim().escape(),
    validarCampos
] ,postCategoria)

router.put('/:id', [
    validarJWT,
    check('id', 'El formato del identificador de la categoria es invalido.').not().isEmpty().isNumeric(),
    check('nombre','El nombre de la categoria es obligatorio').not().isEmpty().trim().escape(),
    validarCampos
] ,putCategoria)

module.exports = router;