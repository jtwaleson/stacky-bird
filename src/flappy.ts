/// <reference path="main.ts"/>

class Flappy {
    top: number;
    left: number;
    direction: Direction;
    div: JQuery;
    factory: Factory;

    constructor (top: number, left: number, direction: Direction, factory: Factory) {
        this.top = top;
        this.left = left;
        this.direction = direction;
        this.factory = factory;
        this.div = $('<div class="flappy flappy1">');
        this.factory.tileContainer.append($('<div class="tile">').addClass('tile-position-' + this.left + '-' + this.top).append(this.div));
    }
    moveInDirection (direction: Direction) {
        this.div.removeClass('flappy-up flappy-down flappy-right flappy-left').addClass('flappy-' + Direction[direction].toLowerCase());
        this._flap();

        if (direction === Direction.UP)
            this.top -= 1;
        else if (direction === Direction.DOWN)
            this.top += 1;
        else if (direction === Direction.LEFT)
            this.left -= 1;
        else
            this.left += 1;
 
        if (this._isOutOfBounds()) {
            throw "out of bounds";
        }
        this.direction = direction;
        this.drawPosition();
    }
    drawPosition() {
        this.div.closest('.tile').attr('class').split(/\s+/).forEach((_className: string) => {
            if (_className.indexOf('tile-position') === 0) {
                this.div.closest('.tile').removeClass(_className);
            }
        });
        this.div.closest('.tile').addClass('tile-position-' + this.left + '-' + this.top);
     }
    _isOutOfBounds() {
        return (
            this.left < 0
            ||
            this.top < 0
            ||
            this.left >= this.factory.board[0].length
            ||
            this.top >= this.factory.board.length
        );
    }
    _flap() {
        this.div.attr('class').split(/\s+/).forEach((_className: string) => {
            if (_className === 'flappy1') {
                this.div.addClass('flappy2').removeClass('flappy1');
            } else if (_className === 'flappy2') {
                this.div.addClass('flappy1').removeClass('flappy2');
            }
        });
    }
    die() {
        this.div.addClass('dead');
    }
    destroy() {
        this.div.closest('.tile').remove();
        this.factory.flappy = null;
    }
}
