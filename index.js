// const http = require('http'); // déclarer la classe http  pour les requetes

require("dotenv").config();

const app = require('./app'); // Nous importons l'application que nous venons de créer

const {PORT} = process.env;

/* definition de la fonction startproject */

const startApp = () => {
        app.listen(PORT, () => {     // ecoute le serveur
        console.log(`Backend listenning on port ${PORT}`);
    });
};


startApp();




// app.set('port', process.env.PORT || 4000); // On définit le port sous lequel l'applicztion est censé tourné ....



