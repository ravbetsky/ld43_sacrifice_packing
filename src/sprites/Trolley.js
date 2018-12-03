import Phaser from 'phaser'

const SPEED = 40;

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, switchers, map }) {
    super(game, x, y, asset);
    this.switchers = switchers;
    this.map = map;

    this.mover = makeMover(this);
  }

  update() {
    const trolleyCenter = {
      x: this.body.x + this.body.width/2,
      y: this.body.y + this.body.height/2,
    }

    const tile = this.map.getTileWorldXY(
      trolleyCenter.x,
      trolleyCenter.y,
      48,
      48,
      'path');

    if (tile !== null) {
      const centerTilePoint = {
        x: tile.worldX + tile.centerX,
        y: tile.worldY + tile.centerY,
      }

      const centerTrolleyPoint = {
        x: tile.worldX + tile.centerX,
        y: tile.worldY + tile.centerY,
      }

      if (Phaser.Math.distancePow(trolleyCenter.x, trolleyCenter.y, centerTilePoint.x, centerTilePoint.y) < 5) {
        this.mover(tile.properties.direction)
      }
    } else {
      const closestSwitcher = this.switchers
        .sort((a, b) => {
          const distanceA = Phaser.Math.distancePow(trolleyCenter.x, trolleyCenter.y, a.x, a.y);
          const distanceB = Phaser.Math.distancePow(trolleyCenter.x, trolleyCenter.y, b.x, b.y);
          return distanceA - distanceB;
        })[0]
      const distance = Phaser.Math.distancePow(trolleyCenter.x, trolleyCenter.y, closestSwitcher.x, closestSwitcher.y);
      if (distance > 50) {
        this.destroy();
      }
      if (distance < 5) {
        this.mover(closestSwitcher.directions[closestSwitcher.directionIndex]);
      }
    }    
  }
}

function makeMover(trolley) {
  const directions = ['left_bottom', 'left_top', 'top_right', 'bottom_right', 'horizontal', 'vertical'];
  let direction = '';
  return function(newDirection) {
    if (direction !== newDirection) {
      switch(newDirection) {
        case 'vertical':
          if (trolley.body.velocity.y < 0) {
            trolley.body.velocity.x = 0;
            trolley.body.velocity.y = -SPEED;
          } else {
            trolley.body.velocity.x = 0;
            trolley.body.velocity.y = SPEED;
          }
          break;
        case 'horizontal':
          trolley.body.velocity.y = 0;
          if (trolley.body.velocity.x < 0) {
            trolley.body.velocity.x = -SPEED;
          } else {
            trolley.body.velocity.x = SPEED;
          }
          break;
        case 'top_right':
          if (trolley.body.velocity.x < 0) {
            trolley.body.velocity.x = 0;
            trolley.body.velocity.y = -SPEED;
          } else {
            trolley.body.velocity.x = SPEED;
            trolley.body.velocity.y = 0;
          }
          break;
        case 'bottom_right':
          if (trolley.body.velocity.y < 0) {
            trolley.body.velocity.y = 0;
            trolley.body.velocity.x = SPEED;
          } else {
            trolley.body.velocity.y = SPEED;
            trolley.body.velocity.x = 0;
          }
          break;
        case 'left_bottom':
          if (trolley.body.velocity.y < 0) {
            trolley.body.velocity.y = 0;
            trolley.body.velocity.x = -SPEED;
          } else {
            trolley.body.velocity.y = SPEED;
            trolley.body.velocity.x = 0;
          }
          break;
        case 'left_top':
          if (trolley.body.velocity.y > 0) {
            trolley.body.velocity.y = 0;
            trolley.body.velocity.x = -SPEED;
          } else {
            trolley.body.velocity.y = -SPEED;
            trolley.body.velocity.x = 0;
          }
          break;
      }
      direction = newDirection;
    }
  }
}
