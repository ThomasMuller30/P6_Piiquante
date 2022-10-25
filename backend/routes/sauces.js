const express = require('express'); //va chercher express
const auth = require('../middleware/auth'); //va chercher auth dans le dossier middleware qui permettra de vérifier les tokens
const multer = require('../middleware/multer-config'); //va chercher la configuration de multer dans les middleware
const sauceCtrl = require('../controllers/sauces'); // va chercher les controllers de sauce

const router = express.Router(); //utilise la méthode router de express

//routes
router.get('/', auth, sauceCtrl.getAllSauce); //route qui récup toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce); //route qui créer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); //route qui récup une seule sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); //route qui permet de modifier une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); //route qui permet de supprimer une sauce
router.post('/:id/like', auth, sauceCtrl.likesDislikesSauce); //route qui va détecter si un utilisateur like ou dislike une sauce

module.exports = router; //permet d'exporter le routeur sauce avec toutes ses routes