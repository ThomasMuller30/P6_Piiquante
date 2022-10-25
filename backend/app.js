require('dotenv').config(); //va chercher le fichier .env et l'utilise comme fichier de configuration
const express = require('express'); //va chercher express
const mongoose = require('mongoose'); //va chercher mongoose
const User = require('./models/User'); //va chercher le modèle d'utilisateur
const Sauce = require('./models/Sauce'); //va chercher le modèle de sauce
const userRoutes = require('./routes/user'); //va chercher le routeur d'utilisateur
const sauceRoutes = require('./routes/sauces'); //va chercher le routeur des sauces
const path = require('path'); //va chercher path
const helmet = require('helmet'); //va chercher helmet pour renforcer la sécurité
const rateLimit = require('express-rate-limit'); //va cherche express-rate-limit pour éviter les brutes forces


//connection à la BDD mongoDB
mongoose.connect(process.env.DB_STRING,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());
// app.use(helmet());
// app.use(rateLimit());

app.use((req, res, next) => {//contourner les erreurs CORS
  res.setHeader('Access-Control-Allow-Origin', '*');//toute adresse peut se co
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//routes autorisées
  next();
});

app.use('/api/sauces', sauceRoutes); //va chercher les routes pour les sauces
app.use('/api/auth', userRoutes); //va chercher les routes pour les authentifications utilisateurs
app.use('/images', express.static(path.join(__dirname, 'images'))); //route pour les fichiers statiques (img)

module.exports = app;