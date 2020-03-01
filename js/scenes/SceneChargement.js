// ALAIN PHAM (gr 1)
// STÉPHANIE DANG (gr 2)

//Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Class representant la scène du jeu qui charge les médias
 * @extends Phaser.Scene
 */

export class SceneChargement extends Phaser.Scene {
    /**
     * @constructor
     * @param {Phaser.Scene}	scene		    Référence à la scène du chargement
     * @param {Object}          barre           Forme rectangle pour la progression du chargement
     * @param {String}	    	progressionTxt	Clé pour récupérer l'image chargée 
     */    
    constructor() {
        super("SceneChargement");

        //Propriété de la scène de chargement
        this.barre;             //l'objet graphique pour afficher le chargement
        this.progressionTxt;    //Le texte pour afficher le % chargé
    }
    
    preload() {
        this.grille = new GrilleMontage(this, 5, 7);
        // this.grille.afficherGrille();

        //-------------------------------------------------------------------------------
        //Barre de progression du chargement du jeu
        let posX = game.config.width * 0.1,
            posY = game.config.height / 2,
            largeur = game.config.width * 0.8,
            hauteur = game.config.height * 0.10;

        this.barre = this.add.rectangle(posX, posY, largeur, hauteur, 0xFFA500);
        this.barre.setOrigin(0, 0.5);
        
        //Texte pour la progression
        this.progressionTxt = this.add.text(game.config.width / 2, game.config.height / 2, "0%", {
            font: `bold ${Math.round(64 * GrilleMontage.ajusterRatioX())}px Arial`,
            color: "#25AAE1",
            align: "center"
        });
        this.progressionTxt.setFontFamily("Baloo Bhai");
        this.progressionTxt.setOrigin(0.5);

        //Texte pour le chargement
        this.chargementTxt = this.add.text(game.config.width / 2, 0, "CHARGEMENT", {
            font: `bold ${Math.round(48 * GrilleMontage.ajusterRatioX())}px Arial`,
            color: "#25AAE1",
            align: "center"
        });
        this.chargementTxt.setFontFamily("Baloo Bhai");
        this.chargementTxt.setOrigin(0.5);
        this.grille.placerIndexCellule(12, this.chargementTxt);
        //-------------------------------------------------------------------------------
        
        //Charger les images du jeu
        this.load.setPath("medias/img/");
        this.load.image("titre");           //Titre du jeu
        this.load.image("blok");            //Personnage contrôlable
        this.load.image("barre");           //Obstacle
        this.load.image("fond");            //Fond d'écran de la scène du jeu
        this.load.image("menuFond");        //Fond d'écran du menu
        this.load.image("instructions");    //Instructions

        //Feuilles de sprites
        this.load.spritesheet("boutons", "boutons.png", {    //Boutons play/pause/menu/rejouer
            frameWidth: game.blok.TAILLE_BOUTONS,
            frameHeight: game.blok.TAILLE_BOUTONS
        });

        this.load.spritesheet("explosion", "explosion.png", {
            frameWidth: game.blok.TAILLE_EXPLOSION,
            frameHeight: game.blok.TAILLE_EXPLOSION
        })

        //Charger les sons
        this.load.setPath("medias/sons");
        this.load.audio("musique", ["musique.mp3", "musique.ogg"]);     //Musique d'ambiance
        this.load.audio("sonMort", ["sonMort.mp3", "sonMort.ogg"]);     //Son de mort
        this.load.audio("sonBouge", ["sonBouge.mp3", "sonBouge.ogg"]);  //Son lors de mouvement
        this.load.audio("sonFin", ["sonFin.mp3", "sonFin.ogg"]);        //Son de fin de partie

        //Gestionnaire d'événement pour suivre la progression du chargement
        this.load.on("progress", this.afficherProgression, this);
    }

    //Passe à la scène d'instructions
    create() {
        this.scene.start("SceneIntro");
    }

    /**
     * Affiche la progression du chargement
     * @param {Number} pourcentage Taux de chargement exprimé en nombre décimal
     */
    afficherProgression(pourcentage) {
        this.progressionTxt.text = Math.floor(pourcentage) * 100 + " %";
        this.barre.scaleX = pourcentage;
	}    
}