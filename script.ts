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

    constructor (top: number, left: number, direction: Direction, div: JQuery, factory: Factory) {
        this.top = top;
        this.left = left;
        this.direction = direction;
        this.div = div;
        this.factory = factory;
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
    execute(stack: Stack) : Direction {
        return Direction.UP;
    }
}
class RandomAction extends Action {
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
    div: any;
    action: Action;
    constructor() {
        this.div = $('<div class="grid-cell">');
        this.action = new RandomAction();
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
        if (width < 0 || width < 0) {
            throw "Sizing of Factory should be larger than 0";
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
                var newField = new Field();
                newField.div.appendTo(gridRow);
                this.board[i][j] = newField;
            }
        }
        this.flappy = new Flappy(4, 4, Direction.RIGHT, this.div.find('.flappy'), this);
    }
    step () {
        var currentField = this.board[this.flappy.top][this.flappy.left];
        if (currentField.action) {
            this.flappy.moveInDirection(currentField.action.execute(this.stack));
        }
        
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
    fm.factories.push(new Factory(10, 10, '.factory'));
    fm.run();
});
