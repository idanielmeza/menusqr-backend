const {Router} = require('express');
const {getProductos, getProductoById, postProductos, deleteProductos, putProductos, getByCategoria} = require('../controllers/productosController');
const {validarJWT} = require('../middlewares/validarJWT');
const {validarCampos} = require('../middlewares/validarCampos');
const { check } = require('express-validator');

const router = Router();

router.get('/',[
    validarCampos
],getProductos);

router.get('/:id',[
    check('id','Formato incorrecto del identificador').not().isEmpty().isNumeric(),
    validarCampos
] ,getProductoById);


router.get('/categoria/:id',[
    check('id','Formato incorrecto del identificador').not().isEmpty().isNumeric(),
    validarCampos
] ,getByCategoria)

router.post('/',[
    validarJWT,
    check('nombre','El nombre del producto es obligatorio').trim().not().isEmpty().escape(),
    check('precio', 'El precio del producto es obligatorio').not().isEmpty().isNumeric(),
    check('descripcion','La descripcion del producto es obligatoria').trim().not().isEmpty().escape(),
    check('categoria_id','La categoria es obligatoria').not().isEmpty().isNumeric(),
    validarCampos
] ,postProductos);

router.put('/:id',[
    validarJWT,
    check('id','Formato incorrecto del identificador').not().isEmpty().isNumeric(),
    check('nombre','El nombre del producto es obligatorio').trim().not().isEmpty().escape(),
    check('precio', 'El precio del producto es obligatorio').trim().not().isEmpty().isNumeric().escape(),
    check('descripcion','La descripcion del producto es obligatoria').trim().not().isEmpty().escape(),
    check('categoria_id','La categoria es obligatoria').not().isEmpty().isNumeric(),
    validarCampos
] ,putProductos);

router.delete('/:id',[
    validarJWT,
    check('id','Formato incorrecto del identificador').not().isEmpty().isNumeric(),
    validarCampos
] ,deleteProductos);

module.exports = router;