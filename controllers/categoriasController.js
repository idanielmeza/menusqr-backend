const getCategorias = async(req,res)=>{
    const {limite=5,pagina=1,negocio} = req.query;

    const connection = res.locals.db;

    // const {usuario} = req;

    try {
        const total = await connection(`select count(c.id) as total from categorias as c inner join users as u on u.id = c.user_id where u.negocio = '${negocio}'`)
        const results = await connection(`SELECT c.nombre, c.id FROM categorias AS c INNER JOIN users AS u ON c.user_id = u.id WHERE u.negocio = '${negocio}'  ORDER BY id LIMIT ${limite} offset ${(pagina -1) * limite}`);
        res.status(200).json({categorias: results, total: total[0].total})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error vuelve a intentarlo'})
    }
    
}
const getCategoriasAll = async(req,res)=>{
    const {negocio} = req.query;

    const connection = res.locals.db;

    // const {usuario} = req;

    try {
        const results = await connection(`SELECT c.nombre, c.id FROM categorias AS c INNER JOIN users AS u ON c.user_id = u.id WHERE u.negocio = '${negocio}'  ORDER BY id`);
        res.status(200).json({categorias: results})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error vuelve a intentarlo'})
    }
    
}

const getCategoriaId = async(req,res)=>{
    const connection = res.locals.db;
    // const {usuario} = req;

    try {
        const results = await connection(`select * from categorias where id = ${req.params.id}`);

        if(results.length == 0){
            return res.status(404).json({
                msg: 'No se encontro categoria'
            })
        }

        return res.status(200).json({categoria: results[0]});
    } catch (error) {
        res.status(500).json({msg: 'Hubo un error vuelve a intentarlo.'})
    }

    
}

const deleteCategoria = async(req,res)=>{

    const {id} = req.params;

    const connection = res.locals.db;

    const {usuario} = req;

    try {
        const results = await connection(`delete from categorias where id = ${id} and user_id = ${usuario}`);

        if(results.affectedRows === 0){
            return res.status(400).json({msg: 'No se encontro la categoria'})
        }

        res.status(200).json({msg: 'Categoria eliminada correctamente.'});
    } catch (error) {
        res.json({msg: 'Hubo un error vuelve a intentarlo'});
    }

}

const postCategoria = async(req,res)=>{

    const {usuario} = req;

    const {nombre} = req.body;

    const connection = res.locals.db;

    try {

        const existe = await connection(`select * from categorias where nombre = '${nombre}' and user_id = ${usuario}`)

        if(existe.length){
            return res.status(400).json({msg: `La categoria: ${nombre} ya existe`})
        }

        const results = await connection(`insert into categorias (nombre, user_id) values('${nombre}', ${usuario})`)

        res.status(201).json({msg: 'Categoria agregada correctamente.'})
    } catch (error) {
        console.log(error);
        res.json({msg: 'Hubo un error vuelve a intentarlo'});
    }

}

const putCategoria = async(req,res)=>{
    const {id} = req.params;

    const {usuario} = req;
    
    const {nombre} = req.body;
    
    const connection = res.locals.db;

    if(!nombre){
        return res.status(404).json({msg: 'Todos los campos son obligatorios'});
    }
    try {

        const existe = await connection(`select id from categorias where id = ${id} and user_id = ${usuario}`);

        if(existe.length){
            const results = await connection(`update categorias set nombre = '${nombre}' where id=${id} `);

            return res.status(201).json({msg:'Categoria actualizada correctamente.'});
        }
        
        return res.status(400).json({msg:'No se encontro la categoria'})
        

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error vuelve a intentarlo'})
    }

}


module.exports = {
    getCategorias,
    getCategoriaId,
    deleteCategoria,
    postCategoria,
    putCategoria,
    getCategoriasAll
}