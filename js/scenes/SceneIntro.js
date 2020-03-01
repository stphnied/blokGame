// ALAIN PHAM (gr 1)
// STÉPHANIE DANG (gr 2)

//Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";

import {
    AnimBlok
} from "../utils/AnimBlok.js";

/**
 * Classe représentant la scène d'intro du jeu
 * @extends Phaser.Scene
 */

export class SceneIntro extends Phaser.Scene {
    /**
     * @constructor
     * @param {Phaser.Scene}	scene		    Référence à la scène d'introduction
     * @param {Array}           tableauSons     Tableau de sons
     * @param {String}          orientationTxt  Avertissement de l'orientation
     */  
    constructor() {
        super("SceneIntro");

        this.tableauSons = [];  //Tableau pour enregistrer les différents sons
        this.orientationTxt;    //Le texte pour la consigne à l'utilisateur
        this.btnJouer;          //Bouton pour passer à la scène d'intro
    }
    
    create() {
        //Afficher la grille
        this.grille = new GrilleMontage(this, 5, 7, 0x00ff00);
        // this.grille.afficherGrille();

        //Fond d'écran
        let menuFondImg = this.add.image(game.config.width / 2, game.config.height / 2, "menuFond");
        menuFondImg.displayWidth = game.config.width;
        menuFondImg.displayHeight = game.config.height;

        //Titre du jeu
        let titreImg = this.add.image(0, 0, "titre");
        titreImg.setScale(0.75 * GrilleMontage.ajusterRatioX())        

        //Dimensions et point d'origine du titre
        titreImg.setOrigin(0.5, 0);
        titreImg.x = -titreImg.displayWidth; //Position initiale du titre

        //Animation du titre
        this.tweens.add({
            targets: titreImg,
            x: game.config.width / 2,
            y: Math.round(25 * GrilleMontage.ajusterRatioY()),
            ease: "Expo.easeOut",
            duration: 750,
            onComplete: this.afficherBtnMenu,
            callbackScope: this
        });

        //Créations des sons de l'introduction
        this.creerSon();           

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

        //Gestion de l'orientation sur mobile
        if (!this.sys.game.device.os.desktop) {
            //Gestion de l'orientation de l'écran
            this.verifierOrientation(this.scale.orientation);
            //Vérification pendant le jeu selon les manipulations du joueur
            this.scale.on("orientationchange", this.verifierOrientation, this);
        } 
    }

    /**
     * Fait descendre le bouton jouer avec une animation
     */
    afficherBtnMenu() {
        //Bouton pour commencer le jeu
        this.btnJouer = this.add.image(0, 0, "boutons", 0);

        //Dimensions et propriétés du bouton
        this.grille.placerIndexCellule(27, this.btnJouer);
        this.grille.mettreEchelleDimensionMaximale(this.btnJouer);

        this.btnJouer.alpha = 0;
        this.btnJouer.y = -this.btnJouer.displayHeight;

        //Animation du bouton
        this.tweens.add({
            targets:  this.btnJouer,
            ease: "Bounce.easeOut",
            duration: 1000,
            props: {
                alpha: 1,
                y: game.config.height - this.grille.hauteurLigne
            }
        });

        //Rend le bouton cliquable
        this.btnJouer.setInteractive({useHandCursor: true});
        this.btnJouer.once("pointerup", this.animerBtnJouer, this);
    }

    /**
     * Créer les sons de la scène d'introduction
     */
    creerSon() {
        //Musique d'ambiance
        // console.log("musique d'ambiance", this.tableauSons[0] === undefined);
        if (this.tableauSons[0] === undefined) {     //Musique d'ambiance
            this.tableauSons[0] = this.sound.add("musique");
            this.tableauSons[0].play({
                volume: 0.25,
                loop: true
            });
        }

        //Son à l'appui du bouton JOUER
        this.tableauSons[1] = this.sound.add("sonBouge", {
            volume: 0.5
        });
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
     * Passe à l'écran d'instructions
     */
    animerBtnJouer() {
        let btnJouerAnim = new AnimBlok(this, this.btnJouer.x, this.btnJouer.y, "boutons", this.btnJouer.frame.name, 1);

        this.time.addEvent({
            delay: 500,
            callback: this.commencerJeu,
            callbackScope: this
        });

    }

    /**
     * Passe à la scène d'instructions
     */
    commencerJeu() {
        this.tableauSons[1].play();
        this.scene.start("SceneInstructions");
        console.log("test");
    }
}