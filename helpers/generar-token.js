module.exports = function generarToken(){
    const rand = ()=> Math.random(0).toString(36).substring(2);
    return (rand()).substring(0,6).toUpperCase();
}