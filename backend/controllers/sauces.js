const Sauce = require('../models/Sauce'); //va chercher le modèle de sauce
const fs = require('fs'); //va chercher le package fs qui servira à supprimer les images

//créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; //supprime l'id de la sauce puisque la BDD va en générer un nouveau
    delete sauceObject._userId; //supprime l'id de la personne qui ajoute la sauce, on utilisera plus tard le token pour plus de sécurité
    const sauce = new Sauce({ //créer une nouvelle sauce via models/Sauce
        ...sauceObject,
        userId: req.auth.userId, //récupère l'id de l'utilisateur une fois qu'il a été encodé
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
        likes: 0, //initialise les likes à 0
        dislikes: 0, //initialise les dislikes à 0
        usersLiked: [], //créer le tableau vide des usersLiked
        usersDisliked: [] //créer le tableau vide des usersDisliked
    });
  
    sauce.save() //sauvegarde la sauce dans la BDD
    .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

  //voir une seule sauce
  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //récup l'id dans l'url de la requête
    .then((sauce) => { res.status(200).json(sauce);})//retourne la sauce grâce à l'id obtenu plus haut
    .catch((error) => { res.status(404).json({ error });});//sinon retourne une erreur
  };

 //modifier une sauce
 exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

 //supprimer une sauce
 exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) { //si l'utilisateur qui fait la requête pour suppr la sauce est différent de l'utilisateur qui a créé la sauce
                res.status(401).json({message: 'Not authorized'}); //retourne le message qu'il n'a pas l'autorisation
            } else {
                const filename = sauce.imageUrl.split('/images/')[1]; //sinon on va utiliser le plugin fs pour supprimer l'image
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id}) //puis on supprime la sauce via l'id de la sauce dans la requete html
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

//voir toutes les sauces
  exports.getAllSauce = (req, res, next) => {
    Sauce.find() //utilise la méthode find de mongoose
    .then((sauces) => { res.status(200).json(sauces);})//retourne une tableau de toutes les sauces
    .catch((error) => { res.status(400).json({ error });});//retourne une erreur
  };



//aimer ou ne pas aimer une sauce
  exports.likesDislikesSauce = (req, res, next) => {
    if (req.body.like === 1) { //si la requête a like strictement = 1
      Sauce.updateOne({ _id: req.params.id }, //récup la sauce par rapport à son Id dans l'url
        {
          $inc: { likes: +1 }, //ajoute 1 like aux likes totaux
          $push: { usersLiked: req.body.userId } //ajoute l'userId de la requête dans le tableau des usersLiked
        })
          .then((sauce) => res.status(200).json({ message: 'Like +1 !' }))
          .catch(error => res.status(400).json({ error }))
  } else if (req.body.like === -1) { //sinon si la requête a like strictement = -1
      Sauce.updateOne({ _id: req.params.id }, //récup la sauce par rapport à son Id dans l'url
        {
           $inc: { dislikes: (req.body.like++) * -1 }, //multiplie le dislike par -1 pour qu'il devienne un +1 à l'ajout
           $push: { usersDisliked: req.body.userId } //ajoute l'userId de la requête dans le tableau des usersDisliked
        })
          .then((sauce) => res.status(200).json({ message: 'Dislike +1 !' }))
          .catch(error => res.status(400).json({ error }))
  } else { //sinon
      Sauce.findOne({ _id: req.params.id }) //récup l'id de la sauce via l'Url
          .then(sauce => {
              if (sauce.usersLiked.includes(req.body.userId)) { //si l'userId est déjà dans le tableau des usersLiked
                  Sauce.updateOne({ _id: req.params.id },
                    {
                      $pull: { usersLiked: req.body.userId }, //retire le userId de la requête dans le tableau des usersLiked
                      $inc: { likes: -1 } //enlève 1 aux likes totaux
                    })
                      .then((sauce) => { res.status(200).json({ message: 'Like -1 !' }) })
                      .catch(error => res.status(400).json({ error }))
              } else if (sauce.usersDisliked.includes(req.body.userId)) { //sinon si l'userId de la requête est déjà dans le tableau des usersDisliked
                  Sauce.updateOne({ _id: req.params.id },
                    {
                      $pull: { usersDisliked: req.body.userId }, //retire l'userId de la requête dans le tableau
                      $inc: { dislikes: -1 } //retire un dislike
                    })
                      .then((sauce) => { res.status(200).json({ message: 'Dislike -1 !' }) })
                      .catch(error => res.status(400).json({ error }))
              }
          })
          .catch(error => res.status(400).json({ error }))
  }
}