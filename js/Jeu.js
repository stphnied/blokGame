// ALAIN PHAM (gr 1)
// STÉPHANIE DANG (gr 2)

//Importation des scripts et des classes nécessaires
import {
    SceneChargement
} from './scenes/SceneChargement.js';
import {
    SceneIntro
} from './scenes/SceneIntro.js';
import {
    SceneInstructions
}
from './scenes/SceneInstructions.js';
import {
    SceneJeu
} from './scenes/SceneJeu.js';
import {
    SceneFinJeu
} from './scenes/SceneFinJeu.js';


//Le jeu est crée quand la page HTML est chargée
window.addEventListener("load", function() {
    //Les dimensions du jeu sur desktop
    let largeur = 640,
        hauteur = 960;
    
    //... et sur mobile
    if (navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("Tablet")) {
        largeur = window.innerWidth,
        hauteur = window.innerHeight;
    }
    
    //Object pour la configuration du jeu
    let config = {
        title: "BLöK",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: largeur,
            height: hauteur
        },
        backgroundColor : 0xFFFFFF,
        scene: [SceneChargement, SceneIntro, SceneInstructions, SceneJeu, SceneFinJeu],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        input: {
            activePointers: 1,
        }
    }

    //Objet de configuration pour le chargement des fontes
    let webFontConfig = {
        active: function() {
            console.log("Les polices de caractères sont chargées");

            //Création du jeu comme objet global
            window.game = new Phaser.Game(config);

            //Propriété sous forme d'objet contenant les grandes caractéristiques du jeu après la création de l'objet global "game"
            window.game.blok = {
                TAILLE_BOUTONS: 146,                //Dimensions du sprite des boutons
                TAILLE_EXPLOSION: 100,              //Dimensions du sprite de l'explosion
                score: 0,                           //Score actuel de la partie
                meilleurScore: 0,                   //Meilleur score enregistré
                NOM_LOCAL_STORAGE: "scoreJeuBlok"   //Sauvegarde et enregistrement des statistiques du jeu
            };             
        },

        //Polices Google chargées
        google: {
            families: ["Baloo Bhai"]
        }
    };

    //Chargement des polices de caractères
    WebFont.load(webFontConfig);
    
}, false);
    
    