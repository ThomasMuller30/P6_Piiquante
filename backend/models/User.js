const mongoose = require('mongoose'); //va chercher le package mongoose
const uniqueValidator = require('mongoose-unique-validator'); //va chercher le package unique validor de mongoose qui permet d'utiliser qu'une seule fois l'adresse mail pour créer un compte

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //récupère l'email de l'utilisateur
  password: { type: String, required: true } //récupère le mot de passe de l'utilisateur une fois qu'il sera hashé
});

userSchema.plugin(uniqueValidator); //utilie le plugin uniqueValidator pour que l'email ne puisse être utilisée qu'une seule fois pour la création d'un compte

module.exports = mongoose.model('User', userSchema); //permet d'exporter le modèle d'utilisateur