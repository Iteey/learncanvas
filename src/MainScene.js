import { Scene } from "phaser";
import atlas from './assets/0x72_DungeonTilesetII_v1.4.png';
import atlasJSON from './assets/atlas.json';
import mapJSON from './assets/map.json';
import { Player } from "./Player";
import { InputManager } from "./InputManager";

export class MainScene extends Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.atlas('atlas', atlas, atlasJSON);
        this.load.tilemapTiledJSON('map', mapJSON);
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('0x72_DungeonTilesetII_v1.4', 'atlas');
        const floor = map.createLayer(0, tiles, 0, 0);
        floor.setScale(4);
        floor.setCollisionByExclusion([130]);
        const walls = map.createLayer(1, tiles, 0, 0);
        walls.setScale(4);
        const edges = map.createLayer(2, tiles, 0, 0);
        edges.setScale(4);
        
        this.player = new Player(this, 100, 100);
        this.add.existing(this.player);
        this.physics.add.collider(this.player, floor);

        this.arrowCountText = this.add.text(10, 10, `Arrows: 0/${this.player.maxArrows}`, {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#ffffff',
        });

        this.inputManager = new InputManager(this);

        // Spawn item
        this.spawnItem(400, 200);
        this.load.image('arrows', './assets/arrows.png');

    }

    spawnItem(x, y) {
        const item = this.physics.add.sprite(x, y, 'atlas', 'item');
        this.physics.add.overlap(this.player, item, () => {
            this.player.pickUpItem();
            item.destroy();
        });
        item.setTexture('arrows');

    }

    update() {
        const { keys } = this.inputManager;
        
        // Player movement
        if (keys.KeyA.isDown) {
            this.player.body.setVelocityX(-this.player.body.maxSpeed);
            this.player.setFlipX(true);
        } else if (keys.KeyD.isDown) {
            this.player.body.setVelocityX(this.player.body.maxSpeed);
            this.player.setFlipX(false);
        } else {
            this.player.body.setVelocityX(0);
        }

        if (keys.KeyW.isDown) {
            this.player.body.setVelocityY(-this.player.body.maxSpeed);
        } else if (keys.KeyS.isDown) {
            this.player.body.setVelocityY(this.player.body.maxSpeed);
        } else {
            this.player.body.setVelocityY(0);
        }
    }
}
