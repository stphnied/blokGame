// ALAIN PHAM (gr 1)
// STÉPHANIE DANG (gr 2)

//Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Classe représentant la scène du jeu tel quel
 * @extends Phaser.Scene
 */

export class SceneJeu extends Phaser.Scene {
    /**
     * @constructor
     * @param {Phaser.Scene}	scene		    Référence à la scène de jeu
     * @param {String}          scoreTxt        Valeur du temps écoulé
     * @param {Object}          minuterie       Calcule le temps écoulé
     * @param {Object}          btnPleinEcran   Permet de redimensionner l'écran
     * @param {Object}          btnPause        Permet de mettre le jeu en pause
     * @param {String}          orientationTxt  Avertissement de l'orientation
     * @param {Number}          tempsToucher    Temps au moment du clic/tap
     * @param {Object}          genereObstacles
     * @param {Array}           tableauSons     Tableau de sons
     * @param {Object}          blok            Joueur
     * @param {Object}          lesFleches      Flèches du clavier pour le mouvement
     * @param {Object}          lesCles         WASD du clavier pour le mouvement
     */  
    constructor() {
        super("SceneJeu");
        
        //Propriétés générales de la scène du jeu
        this.scoreTxt;              //Objet pour afficher le temps écoulé
        this.minuterie;             //Calcule le temps survécu par le joueur
        this.btnPleinEcran;         //Met ou enlève le plein-écran
        this.btnPause;              //Permet de pauser et de continuer le jeu
        this.orientationTxt;        //Le texte pour la consigne à l'utilisateur
        this.explosion;             //Sprite de l'explosion
        this.tempsToucher = 0;      //Temps au moment d'un clic/tap
        this.genereObstacles;       //Tweens pour créer des obstacles

        //Audio
        this.tableauSons = [];      //Tableau pour enregistrer les sons

        //Joueur
        this.blok = null;           //L'image du personnage 
        this.lesFleches = null;     //Les touches fléchées du clavier 
        this.lesCles = null;        //Les touches WASD


        //Statistiques du jeu antérieures
        console.log(localStorage.getItem(game.blok.NOM_LOCAL_STORAGE) === null);
        game.blok.meilleurScore = localStorage.getItem(game.blok.NOM_LOCAL_STORAGE) === null ? 0 : localStorage.getItem(game.blok.NOM_LOCAL_STORAGE);
    }
    
    init() {
        //Initialiser le score et la vitesse de déscente des barres
        game.blok.score = 0;
        this.vitesseDescente = 0;
    }
    
    create () {
        //Afficher la grille
        this.grille = new GrilleMontage(this, 5, 7, 0x00ff00);
        // this.grille.afficherGrille();
       
        //Image du fond
        let imgFond = this.add.image(game.config.width / 2, game.config.height / 2, "fond");
        imgFond.alpha = 0.5;

        //Indicateurs de déplacement (espace de déplacement)
        this.placerIndicateursDeplacement();

        //Blök (joueur)
        this.blok = this.physics.add.image(0, 0, "blok");
        this.grille.placerIndexCellule(27, this.blok);
        this.blok.setScale(GrilleMontage.ajusterRatioX());

        //Le Blök ne peut pas sortir des limites du jeu
        this.blok.setCollideWorldBounds(true);
        
        //Enregistrer les sons du jeu
        this.tableauSons[0] = this.sound.add("sonMort", { volume: 0.5 });  //Quand le joueur touche un obstacle
        this.tableauSons[1] = this.sound.add("sonBouge", { volume: 0.05 }); //Quand le joueur bouge le Blök

        //Création des barres
        this.creationBarres = this.time.addEvent({
            delay: 1500,         //Sera réduit au fil du temps pour rendre plus difficile
            loop: true,
            callback: this.placerBarres,
            callbackScope: this
        });

        //Part la minuterie pour le temps survécu
        this.minuterie = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.augmenterTemps,
            callbackScope: this
        });

        //Affiche le score (temps survécu)
        this.montrerScore();

        // //Bouton pour pauser le jeu
        // this.btnPause = this.add.image(0, 0, "boutons", 1);
        // this.grille.mettreEchelleDimensionMaximale(this.btnPause);
        // this.grille.placerIndexCellule(34, this.btnPause);
        // this.btnPause.setScale(0.5 * GrilleMontage.ajusterRatioX());    //Taille
        // this.btnPause.alpha = 0.5;  //Transparence
        // this.btnPause.setInteractive({useHandCursor: true});    //Rend le bouton cliquable
        // this.btnPause.on("pointerup", this.mettreEnPause, this)

        //-------------------------------------------------------------------------------
        //Style pour l'avertissement pour l'orientation du jeu
        let styleOrientationTxt = {
            font: `bold ${Math.round(48 * GrilleMontage.ajusterRatioX())}px Arial`,
            color: "#000000",
            align: "center",
            wordWrap: {width: game.config.width * 0.9}
        }        

        //Texte pour l'avertissement pour l'orientation de l'écran
        this.orientationTxt = this.add.text(game.config.width / 2, game.config.height / 2, "", styleOrientationTxt);
        this.orientationTxt.setFontFamily("Baloo Bhai");
        this.orientationTxt.setOrigin(0.5);
        //-------------------------------------------------------------------------------

        //Gestion du plein écran sur desktop ou de l'orientation de l'écran sur mobile
        // -- Desktop
        if (this.sys.game.device.os.desktop === true) {
            //Bouton pour agrandir/rétrécir l'écran
            this.btnPleinEcran = this.add.image(game.config.width, 0, "boutons", 4);
            this.btnPleinEcran.setScale(0.5);   //Taille
            this.btnPleinEcran.alpha = 0.5;     //Transparence
            this.grille.placerIndexCellule(4, this.btnPleinEcran);  //Position
            this.btnPleinEcran.setInteractive({useHandCursor: true});   //Rend le bouton cliquable

            //Gestionnaire d'évènements sur le bouton
            this.btnPleinEcran.on("pointerup", this.agrandirRetrecirEcran, this);

            //Déplacement de Blök avec les touches du clavier
            //Instancier un objet pour détecter les touches FLÉCHÉES du clavier
            this.lesFleches = this.input.keyboard.createCursorKeys();
            //... et un autre pour les touches "A" et "D" du clavier
            this.lesCles = this.input.keyboard.addKeys("A,D");            
        }

        // -- Mobile
        else {
            //Gestion de l'orientation de l'écran
            this.verifierOrientation(this.scale.orientation);
            //Vérification pendant le jeu selon les manipulations du joueur
            this.scale.on("orientationchange", this.verifierOrientation, this);

            //Déplacement de Blök avec la souris ou un doigt
            this.input.on("pointerdown", this.deplacerAvecClic, this);
            this.input.on("pointerup", this.deplacerAvecClic, this);            
        }
    }

    update() {
        //Si le jeu est joué sur desktop
        if (this.sys.game.device.os.desktop) {
            this.deplacerAvecClavier();
        }

        //Les barres descendent de plus en plus vite au fil du temps
        if (this.vitesseDescente < 2000) {
            this.vitesseDescente += 1;
        }

        //Les barres apparaissent de plus en plus souvent
        if (this.delaiBarre < 750) {
            this.delaiBarre -= 0.5;
        }
    }

    /**
     * Affiche l'espace de déplacement du Blök
     */
    placerIndicateursDeplacement() {
        if (!this.sys.game.device.os.desktop) {
            //Rectangles de l'espace de déplacement (mobile)
            //Gauche
            let espaceDeplacementGauche = this.add.rectangle(0, 0, this.grille.largeurColonne * 4, this.grille.hauteurLigne, 0xf23c06);
            this.grille.placerIndexCellule(25, espaceDeplacementGauche);
            espaceDeplacementGauche.setOrigin(0.5);
            espaceDeplacementGauche.alpha = 0.25;
            //Droite
            let espaceDeplacementDroite = this.add.rectangle(0, 0, this.grille.largeurColonne * 4, this.grille.hauteurLigne, 0xf89c12);
            this.grille.placerIndexCellule(29, espaceDeplacementDroite);
            espaceDeplacementDroite.setOrigin(0.5);
            espaceDeplacementDroite.alpha = 0.25;
        }

        else {
            let espaceDeplacement = this.add.rectangle(0, 0, game.config.width, this.grille.hauteurLigne, 0xf23c06);
            this.grille.placerIndexCellule(27, espaceDeplacement);
            espaceDeplacement.setOrigin(0.5);
            espaceDeplacement.alpha = 0.25;
        }
    }
    
    /**
     * Déplacement du personnage Blök
     */
    deplacerAvecClavier() {
        //Si aucune touche n'est enfoncée
        this.blok.setVelocity(0);

        //Touche GAUCHE
        if (this.lesFleches.left.isDown || this.lesCles.A.isDown){
            //Le Blök se déplace vers la gauche
            (this.vitesseDescente >= 800) ? this.blok.setVelocityX(this.vitesseDescente * -1.25) : this.blok.setVelocityX(-1000);
            this.tableauSons[1].play();
        }

        //Touche DROITE
        else if (this.lesFleches.right.isDown || this.lesCles.D.isDown){
            //Le Blök se déplace vers la droite
            (this.vitesseDescente >= 800) ? this.blok.setVelocityX(this.vitesseDescente * 1.25) : this.blok.setVelocityX(1000);
            this.tableauSons[1].play();
        }
    }

    /**
     * Déplacement du personnage Blök avec un doigt ou la souris
     * @param {Phaser.Pointer} pointeur dispositif de pointage (souris/doigt)
     * @param {Object} blok joueur
     */
    deplacerAvecClic(pointeur, blok) {
        //Lors d'un tap/clic
        if (pointeur.downTime - this.tempsToucher > 0) {
            //Analyse si le clic est à gauche ou à droite
            if (pointeur.x < game.config.width / 2) {   //à gauche
                this.blok.setVelocityX(-1000);
                this.tableauSons[1].play();
            }

            else {  //à droite
               this.blok.setVelocityX(1000);
                this.tableauSons[1].play();
            }
        }

        else {  //Si c'est un doubleClic/doubleTap
            //Arrête le déplacement
            this.blok.setVelocityX(0);
        }

        //Enregistrer le temps au tap/clic
        this.tempsToucher = pointeur.downTime;
    }

    /**
     * Placement des barres sur la scène
     */
    placerBarres() {
        //Varier la position des barres aléatoirement
        let positionBarre = Phaser.Math.RND.between(0, 4);

        //Barre
        let imgBarre = this.physics.add.image(0, 0, "barre");   //Ajoute les barres avec des propriétés physiques
        imgBarre.setOrigin(0.5, 0.5);

        //Ajustements des dimensions
        this.grille.mettreEchelleLargeurColonne(imgBarre, 3);   
        imgBarre.scaleY = 1.5 * GrilleMontage.ajusterRatioY();
        // imgBarre.scaleX = GrilleMontage.ajusterRatioX();

        //Place la barre en haut de la scène sur une position horizontale aléatoire
        this.grille.placerIndexCellule(positionBarre, imgBarre);

        //Gestion du comportement de collision du Blök avec les barres
        this.physics.add.collider(this.blok, imgBarre, this.blokMort, null, this);
 
        //Descente des barres
        this.genereObstacles = this.tweens.add({
            targets: imgBarre,
            y: game.config.height,
            duration: 3000 - this.vitesseDescente,  //Les barres tombent plus vite au fil du temps
            onComplete: function() {
                imgBarre.destroy();     //La barre se détruit lorsqu'elle atteint le bas

                //Le délai diminue à chaque nouvelle barre détruite
                if (this.creationBarres.delay > 500) {
                    this.creationBarres.delay -= 50;
                };
            },
            callbackScope: this
        });
    }

    /**
     * Augmente le temps pour le compteur
     */
    augmenterTemps() {
        game.blok.score++;
        this.scoreTxt.text = "" + game.blok.score;
    }

    /**
     * Affiche le score accumulé (temps survécu)
     */
    montrerScore() {
        let styleScoreTxt = {
            font: `bold ${Math.round(64 * GrilleMontage.ajusterRatioX())}px Arial`,
            color: "#25AAE1"
        };
        this.scoreTxt = this.add.text(0, 0, "" + game.blok.score, styleScoreTxt);
        this.scoreTxt.setFontFamily("Baloo Bhai");
        this.scoreTxt.setOrigin(0.5);
        this.grille.placerIndexCellule(2, this.scoreTxt);
    }

    /**
     * Gère le plein-écran sur desktop
     * @param {Phaser.Pointer} pointeur dispositif de pointage (souris/doigt)
    */
    agrandirRetrecirEcran(pointeur) {
        //Si le plein-écran n'est pas actif
        if (!this.scale.isFullScreen) {
            this.scale.startFullscreen();
            this.btnPleinEcran.setFrame(5);
            console.log("plein-écran");
        }

        //Si le plein-écran est actif
        else {
            this.scale.stopFullscreen();
            this.btnPleinEcran.setFrame(4);
            console.log("écran normal");
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
     * Explosion de Blök lors d'une collision avec un obstacle
     * @param {Object} blok joueur
     */
    mettreExplosion(blok) {
        //Affichage du sprite d'explosion
        this.explosion = this.add.sprite(blok.x, blok.y, "explosion");
        GrilleMontage.mettreEchelleRatioX(this.explosion);

        //Définition de l'animation de l'explosion
        this.anims.create({
            key: "animExplose",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 12
        });

        //Faire jouer l'animation d'explosion
        this.explosion.anims.play("animExplose");

        //Animation de l'alpha et de l'échelle
        this.tweens.add({
            targets: this.explosion,
            duration: 1000,
            alpha: 0,
            onComplete: function() {
                this.explosion.destroy();
            },
            callbackScope: this,
        });
    }

    // /**
    //  * Met le jeu en pause
    //  */
    // mettreEnPause() {
    //     console.log(this.scene.pause(this));
    //     (this.scene.pause(this)) ? this.scene.pause(this) : this.scene.resume(this);
    // }

    /**
     * Fin du jeu lorsqu'il rentre en contact avec les barres
     * @param {Phaser.Image} blok joueur
     * @param {Phaser.Image} imgBarre image des obstacles tombants
     */
    blokMort(blok, imgBarre) {
        this.blok.setTint(0xDC143C);        //Ajoute un teint rouge au Blök
        imgBarre.setTint(0xDC143C);         //Ajoute un teint rouge à la barre
        this.tableauSons[0].play();         //Son d'explosion

        this.mettreExplosion(this.blok);    //Animation d'explosion //checking in prorgess

        this.genereObstacles.pause();       //Pose la création d'obstacles
        this.blok.setVelocityX(0);          //Arrête le Blök
        this.input.enabled = false;         //Désactive la détection d'inputs tap/clic
        
        this.tweens.add({                   //Blok disparaît graduellement
            targets: this.blok,
            duration: 500,
            alpha: 0
        })

        this.time.addEvent({                //Changement de scène
            delay: 2000,
            callback: this.finJeu,
            callbackScope: this,
        });
    }

    /**
     * Termine la partie
     */
    finJeu() {
        this.scene.start("SceneFinJeu");
    }
}