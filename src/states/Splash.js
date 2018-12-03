import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('cart', 'assets/images/cart.png')
    this.load.image('human', 'assets/images/human.png')
    this.load.image('goat', 'assets/images/goat.png')
    this.load.image('pig', 'assets/images/pig.png')
    this.load.image('cow', 'assets/images/cow.png')
    this.load.image('house', 'assets/images/death_house.png')
    this.load.image('switcher', 'assets/images/switcher.png')
    this.load.tilemap('map', 'assets/map_01.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('tileset', 'assets/images/tileset.png')
    this.load.audio('ost', ['assets/ost.mp3', 'assets/ost.ogg'], 1, true);
  }

  create () {
    this.state.start('Game')
  }
}
