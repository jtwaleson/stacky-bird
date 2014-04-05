/// <reference path="jquery.d.ts"/>

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
class Place {
    top: number;
    left: number;
    direction: Direction;
    constructor (top: number, left: number, direction: Direction) {
        this.top = top;
        this.left = left;
        this.direction = direction;
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
    place: Place;

    width: number;
    height: number;
    board: Field[][];
    stack: Stack;
    div: JQuery;
    flappyDiv: JQuery;

    constructor (width: number, height: number, div: string) {
        if (width < 0 || width < 0) {
            throw "Sizing of Factory should be larger than 0";
        }
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.stack = new Stack();
        this.board = [];
        this.div = $(div);
        this.flappyDiv = this.div.find('.flappy');
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
        this.place = new Place(4, 4, Direction.RIGHT);
    }
    step () {
        if (
            this.place.left < 0
            ||
            this.place.top < 0
            ||
            this.place.left >= this.board[0].length
            ||
            this.place.top >= this.board.length
        ) {
            this.flappyDiv.addClass('dead');
            throw "out of bounds";
        }
        var currentField = this.board[this.place.top][this.place.left];
        this.flappyDiv.attr('class').split(/\s+/).forEach((_className: string) => {
            if (_className.indexOf('tile-position') === 0) {
                this.flappyDiv.removeClass(_className);
            }
            if (_className === 'flappy1') {
                this.flappyDiv.addClass('flappy2').removeClass('flappy1');
            } else if (_className === 'flappy2') {
                this.flappyDiv.addClass('flappy1').removeClass('flappy2');
            }
        });
        this.flappyDiv.addClass('tile-position-' + this.place.left + '-' + this.place.top);
        if (currentField.action) {
            var direction = currentField.action.execute(this.stack)
            if (direction === Direction.UP)
                this.place.top -= 1;
            else if (direction === Direction.DOWN)
                this.place.top += 1;
            else if (direction === Direction.LEFT)
                this.place.left -= 1;
            else
                this.place.left += 1;
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
