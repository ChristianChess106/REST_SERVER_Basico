
const {Schema,model} = require('mongoose');
const { schema } = require('./usuario');

const RoleSchema = Schema({

    rol:{
        type:String,
        required:[true,"El rol es obligatorio"]
    }

});

module.exports = model('Role',RoleSchema);
