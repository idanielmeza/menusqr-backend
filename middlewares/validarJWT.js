const jwt = require('jsonwebtoken');

const validarJWT = async(req,res,next)=>{

    const connection = res.locals.db;
    const token = req.header('user-token');

    if(!token){
        return res.redirect('/login')
    }

    try {
        const {uid} =  jwt.verify(token, process.env.KEYTOKENS);

        
        const usuario = await connection(`select id from users where id = ${uid}`)

        if(!usuario.length){
            return res.status(401).json({msg: 'Token no valido - Usuario no existe'})
        }

        if(usuario.estado == 0){
            return res.status(400).json({msg:'El usuario se encuentra desactivado comuniquese con el administrador.'});
        }

        req.usuario = usuario[0].id;

        next();
    } catch (error) {
        console.log(error)
        return res.redirect('/login')

    }

}

module.exports ={
    validarJWT
}