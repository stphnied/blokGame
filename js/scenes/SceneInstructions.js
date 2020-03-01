// ALAIN PHAM (gr 1)
// STÉPHANIE DANG (gr 2)

//Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Classe représentant la scène d'instructions du jeu
 * @extends Phaser.Scene
 */

export class SceneInstructions extends Phaser.Scene {
    /**
     * @constructor
     * @param {Phaser.Scene}	scene		    Référence à la scène d'introduction
     * @param {String}          orientationTxt  Avertissement de l'orientation
     */  
    constructor() {
        super("SceneInstructions");

        this.orientationTxt;    //Le texte pour la consigne à l'utilisateur        
    }

    create() {
        //Afficher la grille
        this.grille = new GrilleMontage(this, 5, 7, 0x00ff00);
        // this.grille.afficherGrille();

        //Fond d'écran
        let imgFond = this.add.image(game.config.width / 2, game.config.height / 2, "fond");
        imgFond.alpha = 0.5;
            
        //Image d'instructions du jeu
        let instructionsImg = this.add.image(game.config.width / 2, game.config.height / 2, "instructions");
        instructionsImg.setScale(GrilleMontage.ajusterRatioX());
        
        //Consigne (texte) pour passer à la scène d'intro
        let styleAppuyerTxt = {
            font: `normal ${Math.round(36 * GrilleMontage.ajusterRatioX())}px Arial`,
            color: "#25AAE1",
            align: "center"
        };
        let appuyerTxt = this.add.text(game.config.width / 2, 0, "APPUYER SUR L'ÉCRAN", styleAppuyerTxt);
        appuyerTxt.setFontFamily("Baloo Bhai");
        appuyerTxt.setOrigin(0.5);
        this.grille.placerColonneLigne(3, 7, appuyerTxt);

        //Animation de la consigne (clignotement)
        this.tweens.add({
            targets: appuyerTxt,
            ease: "Linear",
            duration: 1000,
            repeat: -1,
            yoyo: true,
            props: {
                alpha: 0
            }
        });

        //Écouteur sur la scène pour gérer les clics
        this.input.on("pointerup", this.allerSceneIntro, this);

        //-------------------------------------------------------------------------------
        //Style pour l'avertissement pour l'orientation du jeu
        let styleOrientationTxt = {
            font: `bold ${Math.round(48 * GrilleMontage.ajusterRatioX())}px Arial`,
            color: "#25AAE1",
            align: "center",
            wordWrap: {width: game.config.width * 0.9}
        }        

        //Texte pour l'avertissement pour l'orientation de l'écran
        this.orientationTxt = this.add.text(game.config.width / 2, game.config.height / 2, "", styleOrientationTxt);
        this.orientationTxt.setFontFamily("Baloo Bhai");
        this.orientationTxt.setOrigin(0.5);
        //-------------------------------------------------------------------------------                

        //Gestion de l'orientation sur mobile
        if (!this.sys.game.device.os.desktop) {
            //Gestion de l'orientation de l'écran
            this.verifierOrientation(this.scale.orientation);
            //Vérification pendant le jeu selon les manipulations du joueur
            this.scale.on("orientationchange", this.verifierOrientation, this);
        }        
    }

    /**
     * Vérifie l'orientation de l'écran et gère la pause ou non du jeu
     * @param {String} orientation Chaîne indiquant l'orientation actuelle de l'écran
     */
    verifierOrientation(orientation) {
        if (orientation === Phaser.Scale.LANDSCAPE) {
            //On ajuste le texte et on met le jeu en pause
            this.orientationTxt.text = "Veuillez mettre le téléphone en mode portrait";
            this.scene.pause(this);
        } 
        
        else if (orientation === Phaser.Scale.PORTRAIT) {
            //On enlève le texte et on repart le jeu
            this.orientationTxt.text = "";
            this.scene.resume(this);
        }
    }     

    /**
     * Passe à la scène d'intro
     */
    allerSceneIntro() {
        this.scene.start("SceneJeu");
    }
}
