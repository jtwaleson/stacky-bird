/// <reference path="jquery.d.ts"/>

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
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
        this.factory.div.find('.tile-container').append($('<div class="tile">').addClass('tile-position-' + this.left + '-' + this.top).append(this.div));
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
            this.div.addClass('dead');
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
}
class Stack {
    items: number[] = [];
    pop () {
        if (this.items.length === 0) {
            throw "Stack is empty!";
        }
        return this.items.pop();
    }
    push (item: number) {
        this.items.push(item);
    }
}
class Action {
    div: JQuery;
    constructor(div) {
        this.div = $('<div class="tile-inner">');
        this.div.appendTo($('<div class="tile">').appendTo(div));
    }
    execute(stack: Stack) : Direction {
        return Direction.UP;
    }
}
class RandomAction extends Action {
    constructor(div: JQuery) {
        super(div);
        this.div.text('?');
    }
    execute(stack: Stack) : Direction {
        var r = Math.random();
        if (r < 0.25)
            return Direction.UP;
        else if (r < 0.5)
            return Direction.DOWN;
        else if (r < 0.75)
            return Direction.LEFT;
        else
            return Direction.RIGHT;
    }
}
class Field {
    div: JQuery;
    action: Action;
    top: number;
    left: number;
    constructor(top: number, left: number) {
        this.top = top;
        this.left = left;
    }
    setAction(action: Action) {
        this.action = action;
        this.action.div.closest('.tile').addClass('tile-position-' + this.left + '-' + this.top);
    }
}
class Factory {
    flappy: Flappy;

    width: number;
    height: number;
    board: Field[][];
    stack: Stack;
    div: JQuery;

    constructor (width: number, height: number, div: string) {
        if (width <= 4 || width <= 4) {
            throw "Sizing of Factory should be larger than 4";
        }
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.stack = new Stack();
        this.board = [];
        this.div = $(div);
        var gameContainer = $('<div class="grid-container">');
        gameContainer.appendTo(this.div);
        $(this.div).width(Math.floor(this.width * 120.25));
        $(this.div).height(Math.floor(this.height * 120.25));
        for (var i = 0; i < this.height; i++) {
            this.board[i] = [];
            var gridRow = $('<div class="grid-row">');
            gridRow.appendTo(gameContainer);
            for (var j = 0; j < this.width; j++) {
                var newField = new Field(i, j);
                $('<div class="grid-cell">').appendTo(gridRow);
                this.board[i][j] = newField;
                if (j == 6) {
                    newField.setAction(new RandomAction(this.div.find('.tile-container')));
                }
            }
        }
        this.flappy = new Flappy(4, 4, Direction.RIGHT, this);
    }
    step () {
        var currentField = this.board[this.flappy.top][this.flappy.left];
        var direction = this.flappy.direction;
        if (currentField.action) {
            direction = currentField.action.execute(this.stack);
        }
        this.flappy.moveInDirection(direction);
        
    }
}
class FactoryManager {
    factories: Factory[] = [];
    currentInterval: number = -1;
    run () {
        this.currentInterval = setInterval(() => {
            this.factories.forEach((factory: Factory) => {
                try {
                    factory.step();
                } catch(err) {
                    clearInterval(this.currentInterval);
                    throw err;
                }
            });
        }, 200);
    }
}

$(function () {
    var fm = new FactoryManager();
    fm.factories.push(new Factory(10, 10, '.factory1'));
    fm.run();
});
