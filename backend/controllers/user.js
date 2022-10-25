const bcrypt = require('bcrypt'); //utilise le package bcrypt qui servira au hashage des mdp
const jwt = require('jsonwebtoken'); //utilise le package jwt pour générer des tokens
const User = require('../models/User'); //utilise le modèle User pour stocker les informations utilisateurs
require('dotenv').config(); //va chercher le fichier .env et l'utilise comme fichier de configuration

//fonction d'inscription
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) //hash 10 fois le mdp
    .then(hash => {
      const user = new User({
        email: req.body.email, //récupère l'email utilisateur
        password: hash //récup le mdp une fois qu'il est hashé
      });
      user.save() //va enregistré
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) //indique que l'utilisateur est créé
        .catch(error => res.status(400).json({ error })); //erreur pour l'enregistrement
    })
    .catch(error => res.status(500).json({ error })); //retourne une erreur serveur
};

//fonction de connexion
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //findOne permet de chercher un seul et unique utilisateur
        .then(user => {
            if (!user) { //si l'utilisateur n'existe pas
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'}); //retourne un message vague qui empêche de savoir si l'utilisateur est bien inscrit ou non
            }
            bcrypt.compare(req.body.password, user.password) //si l'utilisateur est trouvé bcrypt va comparer le hashage des mdp
                .then(valid => {
                    if (!valid) { //si mdp incorrect
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); //retourne le message vague
                    }
                    res.status(200).json({ //sinon retourne un statut 200 qui valide la connexion
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, //encode l'id utilisateur pour éviter qu'un autre utilisateur cherche à l'utiliser
                            process.env.JWT_SECRET, //clé secrète qui va encodé le token (il va la récup dans le fichier .env)
                            { expiresIn: '24h' } //délai d'expiration du token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); //retourne une erreur serveur
        })
        .catch(error => res.status(500).json({ error })); //retourne une erreur serveur
 };