/// <reference path="def/jquery/jquery.d.ts"/>
/// <reference path="def/bootstrap/bootstrap.d.ts"/>
/// <reference path="flappy.ts"/>
/// <reference path="actions.ts"/>

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

var allActions = {
    'START': StartAction,
    'DUP': DupAction,
    'RND': RandomAction,
    'UP': UpAction,
    'DOWN': DownAction,
    'LEFT': LeftAction,
    'RIGHT': RightAction,
    'SWP': SwapAction,
    'ADD': AddAction,
    'SUB': SubtractAction,
    'RET': ReturnAction,
    'INP': InputAction,
}

class Stack {
    factory: Factory;
    div: JQuery;

    constructor(factory: Factory) {
        this.factory = factory;
        this.div = this.factory.div.find('.stack');
        this.clear();
    }

    pop (): number {
        if (this.div.children('.item').length === 0) {
            throw "Stack is empty!";
        }
        var last = this.div.children(':last');
        var value = last.data('value');
        last.remove();
        if (this.div.children('.item').length === 0) {
            this.clear();
        }
        return parseInt(value, 10);
    }

    push (item: number) {
        var elem = $('<a href="#" class="list-group-item item">');
        elem.data('value', item + '');
        elem.text(item + '');
        this.div.append(elem);
        this.div.find('.place-holder').remove();
    }

    clear () {
        this.div.empty();
        this.div.append($('<a href="#" class="list-group-item place-holder">').text('The stack is empty'));
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
        this.action.div.closest('.tile').addClass('tile-position-' + this.left + '-' + this.top).data('x', this.left).data('y', this.top);
        this.action.setField(this);
    }
    removeAction() {
        if (this.action) {
            this.action.div.closest('.tile').remove();
        }
        this.action = null;
    }
}
class Factory {
    flappy: Flappy = null;

    width: number;
    height: number;
    startX: number;
    startY: number;
    startDirection: Direction;
    board: Field[][];
    stack: Stack;
    div: JQuery;
    currentInterval: number = null;
    editable: boolean;

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
        this.setEditable(true);
        var tileContainer = $('<div class="tile-container">').appendTo(this.div.find('.game-container'));;
        var buttons = this.div.find('.game-controls');
        var addButton = (name, func) => {
            buttons.append($('<div class="btn-group factory-' + name + '">').append(
                $('<button type="button" class="btn btn-default">').append(
                    $('<span class="glyphicon glyphicon-' + name + '">')
                )
            ).click(func));
        }
        addButton('stop', (event) => {
            this.stop();
        });
        addButton('pause', (event) => {
            this.pause();
        });
        addButton('play', (event) => {
            this.run();
        });
        this.stack = new Stack(this);
        var gridContainer = $('<div class="grid-container">').appendTo(this.div.find('.game-container'));;
        for (var i = 0; i < this.height; i++) {
            this.board[i] = [];
            var gridRow = $('<div class="grid-row">').appendTo(gridContainer);
            for (var j = 0; j < this.width; j++) {
                $('<div class="grid-cell">').appendTo(gridRow).data('x', j).data('y', i);
                this.board[i][j] = new Field(i, j);
            }
        }
        var self = this;
        gridContainer.on('click', '.grid-cell', function (event) {
            if (!self.editable)
                return;
            var field = self.board[$(this).data('y')][$(this).data('x')];
            $('.blockpicker').modal();
            $('.blockpicker .actions').off('click').on('click', '.btn', function () {
                var chosenAction = $(this).data('action');
                if (chosenAction && chosenAction in allActions) {
                    if (chosenAction === 'RET') {
                        var newAction = new allActions[chosenAction](tileContainer, function (value) {
                            self.stop();
                            alert('Return value: ' + value);
                        });
                    } else {
                        var newAction = new allActions[chosenAction](tileContainer);
                    }
                    field.setAction(newAction);
                }
                $('.blockpicker').modal('hide');
            });
        });
        tileContainer.on('click', '.action', function (event) {
            if (!self.editable)
                return;
            var tile = $(this).closest('.tile');
            var field = self.board[tile.data('y')][tile.data('x')];
            field.removeAction();
        });
        this.board[this.startY][this.startX].setAction(new StartAction(tileContainer));
        this.stop();
    }
    addTile(x: number, y: number, text: string) {
        var outerDiv = $('<div>').addClass('tile-position-' + x + '-' + y).addClass('tile');
        var innerDiv = $('<div>').addClass('tile-inner').appendTo(outerDiv);
        innerDiv.text(text);
        outerDiv.addClass('text-length-' + (text.length));
        this.div.find('.tile-container').append(outerDiv);
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
                this.flappy && this.flappy.die();
                throw err;
            }
        }, speed)
        this.setEditable(false);
        this.div.find('.factory-play').hide();
        this.div.find('.factory-pause').show();
        this.div.find('.factory-stop').show();
    }
    pause () {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
        this.div.find('.factory-play').show();
        this.div.find('.factory-pause').hide();
        this.div.find('.factory-stop').show();
    }
    stop () {
        this.pause();
        if (this.flappy) {
            this.flappy.destroy();
            this.flappy = null;
        }
        this.setEditable(true);
        this.stack.clear();
        this.div.find('.factory-stop').hide();
        this.div.find('.factory-play').show();
        this.div.find('.factory-pause').hide();
    }
    destroy () {
        this.stop();
        this.div.remove();
        this.div = null;
        this.board = [];
    }
    isEditable() {
        return this.editable;
    }
    setEditable(editable: boolean) {
        if (editable) {
            this.div.addClass('editable');
        } else {
            this.div.removeClass('editable');
        }
        this.editable = editable;
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
