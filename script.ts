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
        this.place = new Place(5, 5, Direction.RIGHT);
    }
    step () {
        this.div.find('.flappy').removeClass('flappy');
        var currentField = this.board[this.place.top][this.place.left];
        if (currentField && currentField.action) {
            var direction = currentField.action.execute(this.stack)
            if (direction === Direction.UP)
                this.place.top -= 1;
            else if (direction === Direction.DOWN)
                this.place.top += 1;
            else if (direction === Direction.LEFT)
                this.place.left -= 1;
            else
                this.place.left += 1;
            var nextField = this.board[this.place.top][this.place.left];
            nextField.div.addClass('flappy');
        }
        
    }
}
class FactoryManager {
    factories: Factory[] = [];
    run () {
        setInterval(() => {
            this.factories.forEach((factory: Factory) => {
                factory.step();
            });
        }, 200);
    }
}

$(function () {
    var fm = new FactoryManager();
    fm.factories.push(new Factory(10, 10, '.factory'));
    fm.run();
});
