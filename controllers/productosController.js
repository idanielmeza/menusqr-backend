const getProductos = async(req,res)=>{
    const connection = res.locals.db;
    const {limite=5,pagina=1,negocio} = req.query;     
    // const {usuario} = req;

    try {
        const resp = await connection( `select count(p.id) as total from productos as p inner join users as u on u.id=p.user_id where negocio = '${negocio}'`);
        const results = await connection(`select p.id,p.nombre,p.precio,p.descripcion,p.categoria_id, c.nombre as categoria from productos as p inner join users as u on p.user_id = u.id inner join categorias as c on c.id = p.categoria_id where u.negocio = '${negocio}' order by id limit ${limite} offset ${(pagina-1)* limite}`);
        return res.status(200).json({productos: results, total: resp[0].total});

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hubo un error vuelve a intentarlo'
        });
    }

}

const getProductoById = async(req,res)=>{

    const connection = res.locals.db;
    const {id} = req.params;

    try {
        const results = await connection(`select p.nombre,p.precio,p.descripcion,p.categoria_id,c.nombre as categoria from productos as p inner join categorias as c on c.id = p.categoria_id where p.id = ${id}`);
        if(results.length){
            return res.status(200).json({productos: results});
        }

        return res.status(404).json({msg: 'No se encontro el producto'})

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Hubo un error vuelve a intentarlo.'})
    }


}

const postProductos = async(req,res)=>{
    const connection = res.locals.db;

    const {usuario} = req;

    const {categoria_id, precio,descripcion,nombre} = req.body;

    try {
        const existe = await connection(`select id,nombre from categorias where id = ${categoria_id} and user_id = ${usuario}`);
        if(existe.length === 0){
            return res.status(404).json({msg: 'La categoria no existe'});
        }

        const existeProducto = await connection(`select id from productos where nombre = '${nombre}' and categoria_id = ${categoria_id} and user_id = ${usuario}`);
        if(existeProducto.length){
            return res.status(403).json({msg: `Ya existe un producto con nombre: ${nombre} y categoria: ${existe[0].nombre}`})
        }

        const results = await connection(`insert into productos (nombre,precio,descripcion,categoria_id, user_id) values ('${nombre}', '${precio}' , '${descripcion}' , '${categoria_id}', ${usuario})`);

        return res.status(201).json({msg: 'El producto se agrego correctamente'});

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Hubo un error vuelve a intentarlo'});
    }

}

const putProductos = async(req,res)=>{
    const connection = res.locals.db;

    const {usuario} = req;

    const {id} = req.params;
    const {nombre,categoria_id,precio,descripcion} = req.body;

    try {
        const existeProducto = await connection(`select id from productos where id = ${id} and user_id = ${usuario}`);
        if(existeProducto.length){
            const existeCategoria = await connection(`select id from categorias where id = ${categoria_id}  and user_id = ${usuario} `);
            if(existeCategoria.length){
                const results = await connection(`update productos set nombre = '${nombre}', categoria_id = ${categoria_id}, precio = ${precio} , descripcion = '${descripcion}' where id = ${id}`);

                return res.status(201).json({msg: 'El producto se ha actualizado correctamente.'})
            }
            return res.status(404).json({msg: 'La categoria no existe'});
        }
        return res.status(404).json({msg: 'El producto no existe.'})

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Hubo un error vuelve a intentarlo'});   
    }

}

const deleteProductos = async(req,res)=>{
    const connection = res.locals.db;
    const {id} = req.params;
    const {usuario} = req;

    try {

        const results = await connection(`delete from productos where id = ${id}  and user_id = ${usuario}`);
        if(results.rowsAffected === 0){
            return res.status(404).json({msg: 'El producto no existe'});
        }
        return res.status(201).json({msg: 'El producto se ha eliminado correctamente'});

        
    } catch (error) {
        return res.status(500).json({msg:'Hubo un error vuelve a intentarlo'});
    }
}

const getByCategoria = async(req,res)=>{
    // const {usuario} = req;
    const connection = res.locals.db;
    const {id} = req.params;
    const {limite=5,pagina=1,negocio} = req.query;

    try {
        const resp = await connection(`select count(id) as total from productos where categoria_id = ${id}`)
        const results = await connection(`select p.id,p.nombre,p.precio,p.descripcion,p.categoria_id,c.nombre as categoria from productos as p inner join users as u on p.user_id = u.id inner join categorias as c on c.id = p.categoria_id where p.categoria_id = ${id} and u.negocio = '${negocio}' order by id limit ${limite} offset ${(pagina-1)* limite}`);
        return res.status(200).json({productos: results, total: resp[0].total})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Hubo un error vuelve a intentarlo.'})
    }
}

module.exports = {
    getProductos,
    getProductoById,
    postProductos,
    putProductos,
    deleteProductos,
    getByCategoria
}