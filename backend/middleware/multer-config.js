const multer = require('multer'); //va chercher le package multer

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}; //permet de renommer les extensions d'images

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //permet de remplacer les espaces dans les noms d'images par des _
    const extension = MIME_TYPES[file.mimetype]; //converti l'extension de l'image par une définit plus haut
    callback(null, name + Date.now() + '.' + extension); //récupère le nouveau nom, le concatène avec la date du jour et ajoute l'extension pour créer un nom de fichier unique
  }
});

module.exports = multer({storage: storage}).single('image'); //permet d'exporter selon la méthode multer des fichiers de type image uniquement