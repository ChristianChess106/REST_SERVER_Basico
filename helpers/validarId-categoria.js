const { Categoria } = require("../models");

const existeCategoria = async(id) => {

    const categoria = await Categoria.findById(id);

    if(!categoria){
        throw new Error(`La categoria con el id: ${id} no existe, intente de nuevo`)
    }

};

module.exports = {
    existeCategoria
};