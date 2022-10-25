const jwt = require('jsonwebtoken'); //va chercher le package jwt
require('dotenv').config(); //va chercher le fichier .env et l'utilise comme fichier de configuration

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; //récupère le token dans le header authorization
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //décode le token avec la clé de codage
       const userId = decodedToken.userId; //vérifie que le token correspond à l'utilisateur
       req.auth = {
           userId: userId
       };
    next();
   } catch(error) {
       res.status(401).json({ error }); //retourne une erreur
   }
};