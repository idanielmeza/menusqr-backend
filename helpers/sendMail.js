const nodemailer = require('nodemailer');

module.exports = sendMail = (correo,token,res) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.mail,
            pass: process.env.mailPassword
        }
    });
    
    const mailOptions = {
        from: process.env.mail,
        to: correo,
        subject: 'Activacion de cuenta',
        text: `Bienvenido a QrMenus App ingresa el siguiente codigo para activar tu cuenta: ${token}`
    }
    
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            return res.status(500).json({error:'Registro exitoso, hubo un error al enviar el correo, da click en el boton para reenviar el correo'})
        }else{
            return res.status(201).json({msg:'Registro completado exitosamente, se ha enviado el codigo de ativacion a su correo.'});
        }
    })
    
}   