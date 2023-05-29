const mongo = require('mongoose')

let clientSchema = mongo.Schema({
    username: {type: String, require: true},
    email: {type: String, unique: true, require: true},
    password: {type: String, require: true}
})

let Сlient = mongo.model("Client", clientSchema)

module.exports = Сlient