// ALAIN PHAM (gr 1)
// STÉPHANIE DANG (gr 2)

export class AnimBlok extends Phaser.GameObjects.Sprite {
    /**
     * @constructor
     * @param {object Phaser.Scene} scene       Scène où sera affiché l'instance
     * @param {Number} posX = 0                 Position de l'instance sur l'axe horizontale
     * @param {Number} posY = 0                 Position de l'instance sur l'axe vertical
     * @param {String} cleImage			        Clé pour recupérer l'image chargée 
     * @param {Integer} noImage 	            Index de l'image dans la feuille de sprite des boutons
     * @param {Number} echelle              	Échelle initiale du bouton sur l'axe des X er des Y
     */
    constructor(scene, posX = 0, posY = 0, cleImg, noImg, echelle = 1) {
        //Message d'erreur de scène
        if ((scene instanceof Phaser.Scene) != true) {
            console.log("Attention - il n'y a pas de scène! Le blokMort ne peut pas être instanciée...");
            //On sort du constructeur
            return;
        }
        
        super(scene, posX, posY, cleImg, noImg, echelle);

        //Enregistrer la ref de la scene
        this.scene = scene;

        //Ajouter le texte dans la scène
        this.scene.add.existing(this);

        //Ajuster le point d'ancrage
        this.setOrigin(0.5);

        //Partir l'animation
        this.animerBlok();
        }

        //Demare l'animation du bouton
        animerBlok() {
            //Echelle initiale
            this.setScale(1);

            //Animation
            this.scene.tweens.add({
                targets: this,
                props: {
                    scaleX: 1.05,
                    scaleY: 1.05
                },
                duration: 500,
                ease: "Elastic.easeOut",
                onComplete: this.detruireAnimBlok,
                callbackScope: this
            });
        }
        //Detruit apres son animation
        detruireAnimBlok() {
            this.destroy();
        }


}