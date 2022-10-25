const express = require('express'); //va chercher express
const userCtrl = require('../controllers/user'); //va chercher les controllers qui correspondent à user.js

const router = express.Router(); //utilise la méthode router de express

//routes
router.post('/signup', userCtrl.signup); //va chercher le controller d'inscription
router.post('/login', userCtrl.login); //va chercher le controller de connexion

module.exports = router; //permet d'exporter la constante router qui pourra être utilisée dans d'autre fichier.