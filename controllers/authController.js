const bcryptjs = require('bcryptjs');
const {generarJWT} = require('../helpers/generar-jwt');

const singin = async(req,res)=>{
    const connection = res.locals.db;

    const {email, password} = req.body;

    try {
        const existe = await connection(`select id,nombre,apellidop,apellidom,email,negocio,estado,password from users where email = '${email}'`);
        if(existe.length){
            const usuario = existe[0];
            
            //Verificar si esta activo
            if(!usuario.estado){
                return res.status(400).json({msg:'La cuenta se encuentra inactiva.'})
            }
            
            //verificar password
            const validPassword =  bcryptjs.compareSync(password,usuario.password);

            if(validPassword){
                const {password, ...user} = usuario;
                

                const token = await generarJWT(usuario.id);

                return res.status(200).json({
                    token,
                    usuario: user
                })
            }

            return res.status(400).json({msg:'Contraseña incorrecta.'})
        }
        return res.status(404).json({msg:'El usuario no existe.'})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error vuelve a intentarlo.'})
    }

}

const renovarToken = async(req,res)=>{

    const {usuario:id} = req;

    const results = await res.locals.db(`select id,nombre,apellidop,apellidom,email,negocio,estado from users where id = '${id}'`)

    const usuario = results[0];

    const token = await generarJWT( id );

    res.json({
        usuario,
        token
    })

}

module.exports = {
    singin,
    renovarToken
}