import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, type }) {
    super(game, x, y, asset);
    this.type = type;
  }
}
