const mongoose = require('mongoose'); //va chercher le package mongoose

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, // l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
    name: { type: String, required: true }, //nom de la sauce
    manufacturer: { type: String, required: true }, //fabricant de la sauce
    description: { type: String, required: true }, //description de la sauce
    mainPepper: { type: String, required: true }, //principal épice de la sauce
    imageUrl: { type: String, required: true }, //lien de l'image
    heat: { type: Number, required: true }, //nombre entre 1 et 10 décrivant la sauce
    likes: { type: Number, required: true }, //nombre d'utilisateur qui aiment
    dislikes: { type: Number, required: true }, //nombre d'utilisateur qui n'aiment pas
    usersLiked: { type: [String], required: true }, //tableau des utilisateurs qui ont aimé
    usersDisliked: { type: [String], required: true }, //tableau des utilisateurs qui n'ont pas aimé
});

module.exports = mongoose.model('Sauce', sauceSchema); //permet d'exporter le modèle de sauce