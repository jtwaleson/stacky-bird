/// <reference path="def/jquery.d.ts"/>
/// <reference path="flappy.ts"/>
/// <reference path="actions.ts"/>

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
class Stack {
    factory: Factory;
    div: JQuery;

    constructor(factory: Factory) {
        this.factory = factory;
        this.div = $('<ul class="stack">');
        this.factory.div.append(this.div);
    }

    pop (): number {
        if (this.div.children().length === 0) {
            throw "Stack is empty!";
        }
        var last = this.div.children(':last');
        var value = last.data('value');
        last.remove();
        return parseInt(value, 10);
    }

    push (item: number) {
        var li = $('<li>');
        li.data('value', item + '');
        li.text(item + '');
        this.div.append(li);
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
        this.board = [];
        this.div = $(div);
        var gameContainer = $('<div class="grid-container">');
        gameContainer.appendTo(this.div);
        this.stack = new Stack(this);
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
//                    newField.setAction(new RandomAction(this.div.find('.tile-container')));
                }
            }
        }
        this.board[10][5].setAction(new UpAction(this.div.find('.tile-container')));
        this.board[5][8].setAction(new SwapAction(this.div.find('.tile-container')));
        this.board[5][10].setAction(new LeftAction(this.div.find('.tile-container')));
        this.board[2][5].setAction(new DupAction(this.div.find('.tile-container')));
        this.board[0][5].setAction(new DownAction(this.div.find('.tile-container')));
        this.board[5][2].setAction(new AddAction(this.div.find('.tile-container')));
        this.board[5][0].setAction(new RightAction(this.div.find('.tile-container')));
        this.board[8][5].setAction(new SubtractAction(this.div.find('.tile-container')));
        this.board[5][5].setAction(new RandomAction(this.div.find('.tile-container')));
        this.flappy = new Flappy(5, 5, Direction.RIGHT, this);
        this.stack.push(10);
        this.stack.push(20);
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
                    factory.flappy.die();
                    throw err;
                }
            });
        }, 100);
    }
}

$(function () {
    var fm = new FactoryManager();
    fm.factories.push(new Factory(11, 11, '.factory1'));
    fm.run();
});
