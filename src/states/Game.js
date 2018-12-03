/* globals __DEV__ */
import Phaser from 'phaser'
import Victim from '../sprites/Victim'
import Trolley from '../sprites/Trolley'
import House from '../sprites/House'
import Switcher from '../sprites/Switcher'
import lang from '../lang'

const SPEED = 40;

const CREATE_INTERVALS = [
  () => Phaser.Math.between(6000, 10000),
  () => Phaser.Math.between(5000, 7000),
  () => Phaser.Math.between(3000, 5000),
  () => Phaser.Math.between(1500, 2500),
];

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    this.map = this.game.add.tilemap('map')
    this.map.addTilesetImage('Tileset', 'tileset');
    this.layerBg = this.map.createLayer('bg');
    this.layerPath = this.map.createLayer('path');
    this.layerBg.resizeWorld();
    this.layerPath.resizeWorld();

    this.switchers = this.map.objects.switchers.map((data) => {
      const tile = this.map.getTileWorldXY(data.x, data.y, 48, 48, this.layerBg);
      const switcher = new Switcher({
        game: this.game,
        x: tile.worldX + tile.centerX,
        y: tile.worldY + tile.centerY,
      });

      const sprite = this.game.add.existing(switcher);
      sprite.directions = ['left_bottom', 'left_top', 'top_right', 'bottom_right']
      sprite.directionIndex = 0; 
      sprite.anchor.setTo(0.5, 0.5);
      sprite.inputEnabled = true;
      sprite.input.useHandCursor = true;
      sprite.events.onInputDown.add(() => {
        if (sprite.directions.length - 1 == sprite.directionIndex) {
          sprite.directionIndex = 0
        } else {
          sprite.directionIndex += 1
        }
        sprite.angle += 90
      }, this);

      return sprite;
    })

    const types = Phaser.ArrayUtils.shuffle(['Human', 'Pig', 'Cow', 'Goat'])
    this.houses = this.map.objects.houses.map((data, i) => {
      const tile = this.map.getTileWorldXY(data.x, data.y, 48, 48, this.layerBg);
      const house = new House({
        game: this.game,
        x: tile.worldX + tile.centerX,
        y: tile.worldY + tile.centerY,
        asset: 'house',
        type: types[i]
      });

      const sprite = this.game.add.existing(house);
      sprite.anchor.setTo(0.5, 0.5);

      const style = { font: "30px Arial", fill: "green" };
      const text = this.game.add.text(20, 20, types[i], style);
      sprite.addChild(text);
      text.anchor.setTo(0.5, 0.5)
      game.physics.enable(sprite, Phaser.Physics.ARCADE);

      return sprite;
    })

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    const startPoint = this.map.objects.points.find((point) => point.name === 'start')
    const tileStart = this.map.getTileWorldXY(startPoint.x, startPoint.y, 48, 48, this.layerPath)

    const music = this.game.add.audio('ost');

    this.createTrolley(tileStart);

    music.play();

    let counter = 1;

    const trolleyCreator = () => {
      if (counter === 25) {
        return false;
      }
      setTimeout(() => {
        counter += 1
        this.createTrolley(tileStart);
        return trolleyCreator();
      }, getCreatorTimeout(counter));
    }

    trolleyCreator();

    function getCreatorTimeout(c) {
      if (c < 3) {
        return CREATE_INTERVALS[0]()
      } else if (c < 8) {
        return CREATE_INTERVALS[1]()
      } else if (c < 12) {
        return CREATE_INTERVALS[2]()
      } else if (c < 20){
        return CREATE_INTERVALS[3]()
      } else {
        return CREATE_INTERVALS[1]()
      }
    }
  }

  update() {
  }

  createTrolley(tileStart) {
    const trolley = new Trolley({
        game: this.game,
        x: tileStart.worldX + tileStart.centerX - 70,
        y: tileStart.worldY + tileStart.centerY,
        asset: 'cart',
        switchers: this.switchers,
        map: this.map,
      });

    const spriteTrolley = this.game.add.existing(trolley);
    spriteTrolley.anchor.setTo(0.5, 0.5);

    game.physics.enable(spriteTrolley, Phaser.Physics.ARCADE);
    spriteTrolley.body.collideWorldBounds = false;
    spriteTrolley.body.velocity.x = SPEED;

    const type = Phaser.ArrayUtils.getRandomItem(['Human', 'Pig', 'Cow', 'Goat'])
    const victim = new Victim({
        game: this.game,
        x: spriteTrolley.worldX,
        y: spriteTrolley.worldY,
        asset: type.toLowerCase(),
        type: type,
      });
    spriteTrolley.addChild(victim);
    victim.anchor.setTo(0.5, 0.8);
  }
}