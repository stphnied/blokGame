// ALAIN PHAM (gr 1)
// STÉPHANIE DANG (gr 2)

//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Classe représentant la scène de fin du jeu
 * @extends Phaser.Scene
 */

export class SceneFinJeu extends Phaser.Scene {

	constructor() {
		super("SceneFinJeu");
		
		this.tableauSons = []; //Tableau pour enregistrer les differents sons
	}
    
    create() {
        //Afficher la grille
		this.grille = new GrilleMontage(this, 5, 7, 0x00ff00);
		
		//Fond d'écran
		let finFondImg = this.add.image(game.config.width / 2, game.config.height / 2, "fond");
		finFondImg.alpha = 0.5;
		finFondImg.setTint(0xDC143C);

		//Sons
		this.tableauSons[0] = this.sound.add("sonFin", {
			volume: 0.5
		});
		this.tableauSons[0].play();

		this.tableauSons[1] = this.sound.add("sonBouge", {
			volume: 0.5
		});
		
		//Rectangle d'espace pour afficher le score
		this.secteurRect = this.add.rectangle(0, 0, this.grille.largeurColonne * 4, this.grille.hauteurLigne * 2, 0xFFFFFF);
		this.grille.placerColonneLigne(3, 3, this.secteurRect);
		this.secteurRect.alpha = 0.85;

		//Enregistrement du meilleur score
		console.log(game.blok.score, game.blok.meilleurScore);
		game.blok.meilleurScore = Math.max(game.blok.score, game.blok.meilleurScore);
		localStorage.setItem(game.blok.NOM_LOCAL_STORAGE, game.blok.meilleurScore);

		//Texte du score
		let styleScoreFin = {
			font: `bold ${Math.round(52 * GrilleMontage.ajusterRatioX())}px Arial`,
			color: "#280422"
		}
		
		//Données des scores
		let scoreTxt = "Ton score  :  ";
		scoreTxt += game.blok.score + "\n\n";
		scoreTxt += "Meilleur score  :  ";
		scoreTxt += game.blok.meilleurScore;
		
		//Affichage des scores
		let affichageTxt = this.add.text(0, 0, scoreTxt, styleScoreFin);
		affichageTxt.x = game.config.width / 2;				//Position du texte en X
		this.grille.placerColonneLigne(3, 3, affichageTxt);	//Position du texte en Y
		affichageTxt.setOrigin(0.5, 0.5);
		affichageTxt.setFontFamily("Baloo Bhai");
		
		//Afficher boutons pour rejouer ou aller au menu
		this.affichageBtn();
		
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
        //-------------------------------------------------------------------------------		
	}

	affichageBtn() {
		//Bouton pour REJOUER
		let btnRejouer = this.add.image(0, 0, "boutons", 3);
		btnRejouer.setTint(0xDC143C);

		//Dimensions et propriétés du bouton REJOUER
		this.grille.placerIndexCellule(28, btnRejouer);
		this.grille.mettreEchelleDimensionMaximale(btnRejouer);

		//Rend le bouton pour recommencer cliquable
		btnRejouer.setInteractive({useHandCursor: true});
		btnRejouer.once("pointerdown", this.rejouer, this);

		//Bouton pour retourner au MENU
		let btnMenu = this.add.image(0, 0, "boutons", 2);		

		//Dimensions et propriétés du bouton MENU
		this.grille.placerIndexCellule(26, btnMenu);
		this.grille.mettreEchelleDimensionMaximale(btnMenu);

		//Rend le bouton pour retourner au menu cliquable
		btnMenu.setInteractive({useHandCursor: true});
		btnMenu.once("pointerdown", this.retourMenu, this);
		btnMenu.setTint(0xDC143C);
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
	
	/*
		Commence une nouvelle partie
	*/
    rejouer() {
		this.scene.start("SceneJeu");
	}

	/*
		Retour au menu principal
	*/
	retourMenu() {
		this.scene.start("SceneIntro");
	}
}