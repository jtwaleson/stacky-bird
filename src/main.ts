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
    startX: number;
    startY: number;
    startDirection: Direction;
    board: Field[][];
    stack: Stack;
    div: JQuery;
    currentInterval: number = null;
    tileContainer: JQuery;

    constructor (width: number, height: number, startX: number, startY: number, startDirection: Direction, div: string) {
        if (width <= 0 || width <= 0) {
            throw "Sizing of Factory should be larger than 1";
        }
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.startX = Math.floor(startX);
        this.startY = Math.floor(startY);
        this.startDirection = startDirection;
        this.board = [];
        this.div = $(div);
        this.tileContainer = $('<div class="tile-container">').appendTo(this.div);;
        var gameContainer = $('<div class="grid-container">').appendTo(this.div);;
        gameContainer.appendTo(this.div);
        this.stack = new Stack(this);
        for (var i = 0; i < this.height; i++) {
            this.board[i] = [];
            var gridRow = $('<div class="grid-row">');
            gridRow.appendTo(gameContainer);
            for (var j = 0; j < this.width; j++) {
                var gridCell = $('<div class="grid-cell">').appendTo(gridRow).data('x', j).data('y', i);
                this.board[i][j] = new Field(i, j);
            }
        }
        this.addTile(this.startX, this.startY, 'START');
        this.flappy = null;
    }
    addTile(x: number, y: number, text: string) {
        var outerDiv = $('<div>').addClass('tile-position-' + x + '-' + y).addClass('tile');
        var innerDiv = $('<div>').addClass('tile-inner').appendTo(outerDiv);
        innerDiv.text(text);
        outerDiv.addClass('text-length-' + (text.length));
        this.tileContainer.append(outerDiv);
    }
    step () {
        var currentField = this.board[this.flappy.top][this.flappy.left];
        var direction = this.flappy.direction;
        if (currentField.action) {
            var newDirection = currentField.action.execute(this.stack);
            if (newDirection !== null)
                direction = newDirection;
        }
        this.flappy.moveInDirection(direction);
    }
    run (speed: number = 100) {
        if (this.flappy && this.flappy.div.is('.dead')) {
            this.stop();
        }
        if (this.flappy === null) {
            this.flappy = new Flappy(this.startX, this.startY, this.startDirection, this);
        }
        this.currentInterval = setInterval(() => {
            try {
                this.step();
            } catch(err) {
                this.pause();
                this.flappy.die();
                throw err;
            }
        }, speed)

    }
    pause () {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
    }
    stop () {
        this.pause();
        if (this.flappy) {
            this.flappy.destroy();
        }
    }
}
interface LevelSerialized {
    name: string;
    order: number;
    width: number;
    height: number;
    startX: number;
    startY: number;
    startDirection: Direction;
    blocksAvailable: any;
    testCases: any[];
    description: string;
}
class Level {
    factory: Factory;
    name: string;
    description: string;

    constructor (levelObject: LevelSerialized) {
        this.name = levelObject.name;
        this.factory = new Factory(
            levelObject.width,
            levelObject.height,
            levelObject.startX,
            levelObject.startY,
            levelObject.startDirection,
            '.factory1'
        );
        this.description = levelObject.description;
    }
    run(speed: number = 100) {
        this.factory.run(speed);
    }
}
var level;
$(function () {
    level = new Level({
        name: 'MultiMeter',
        order: 1,
        width: 4,
        height: 4,
        startX: 0,
        startY: 0,
        startDirection: Direction.RIGHT,
        blocksAvailable: {
            'Add': 1,
            'Return': 1,
            'Down': 1,
            'Left': 1,
            'Up': 1,
        },
        testCases: [],
        description: 'Multiply two numbers that will be put on the stack',
    });
});
