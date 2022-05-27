const bcryptjs = require('bcryptjs');
const generarTokenActivacion = require('../helpers/generar-token');
const sendMail = require('../helpers/sendMail');

const postUsuario = async (req, res)=>{
    const connection = res.locals.db;

    const {nombre,apellidop,apellidom='', email,negocio,password} = req.body;
    
    //Encrypter password
    const salt = bcryptjs.genSaltSync();
    const passwordHashed = bcryptjs.hashSync(password, salt);

    const slug = negocio.replaceAll(' ', '-');

    const token = generarTokenActivacion();

    try {
        const existe = await connection(`select id from users where negocio = '${slug}' or email = '${email}'`);
        if(existe.length){
            return res.status(400).json({msg: 'El correo/nombre del negocio ya ha sido registrado anteriormente.'})
        }
        
        const results = connection(`insert into users (nombre,apellidop,apellidom,email,negocio,password,estado,token) values('${nombre}', '${apellidop}', '${apellidom}', '${email}', '${slug}', '${passwordHashed}', 0 , '${token}')`);

        sendMail(email,token,res);


    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Hubo un error vuelve a intentarlo'});
    }

}

const putPassword = async(req,res)=>{
    const connection = res.locals.db;

    const {id} = req.params;

    const {password, passwordOld} = req.body;

    try {
        const existe = await connection(`select password from users where id = ${id}`);
        if(existe.length){
            const usuario = existe[0];

            //verificar password
            const validPassword =  bcryptjs.compareSync(passwordOld,usuario.password);

            if(validPassword){
                //Encrypter password
                const salt = bcryptjs.genSaltSync();
                const passwordHashed = bcryptjs.hashSync(password, salt);
                const results = await connection(`update users set password = '${passwordHashed}' where id = ${id}`);
                return res.status(201).json({msg: 'Contraseña actualizada correctamente.'})
            }

            return res.status(400).json({msg:'La contraseña es incorrecta.'})
        }
        return res.status(404).json({msg: 'El usuario no existe.'})
    } catch (error) {
        return res.status(500).json({msg:'Hubo un error vuelve a intentarlo'});
    }
}

const activarUsuario = async(req,res)=>{

    const connection = res.locals.db;
    const {token} = req.params;

    try {
        const results = await connection(`update users set estado = 1 , token = null where token = '${token}'`)
        if(results.affectedRows != 0){
            return res.status(201).json({msg: 'La cuenta ha sido activada correctamente.'})
        }
        return res.status(404).json({msg:'Codigo de activacion invalido.'})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error vuelve a intentarlo.'})
    }
}

module.exports = {
    postUsuario,
    putPassword,
    activarUsuario
}