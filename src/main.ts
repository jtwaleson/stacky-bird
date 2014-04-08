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

var allActionsById = {};
var allActions: any[] = [];
allActions.push(StartAction);
allActions.push(DupAction);
allActions.push(RandomAction);
allActions.push(UpAction);
allActions.push(DownAction);
allActions.push(LeftAction);
allActions.push(RightAction);
allActions.push(SwapAction);
allActions.push(AddAction);
allActions.push(SubtractAction);
allActions.push(InputAction);
allActions.forEach((action: any) => {
    allActionsById[action.identifier] = action;
});

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
    setAction(action: Action, userEditable: boolean = true) {
        this.action = action;
        this.action.div.closest('.tile').addClass('tile-position-' + this.left + '-' + this.top).data('x', this.left).data('y', this.top);
        this.action.setField(this);
        if (!userEditable) {
            this.action.div.closest('.action').addClass('locked');
        }
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

    constructor (width: number, height: number, startX: number, startY: number, startDirection: Direction, div: string, name: string, description: string) {
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
        this.div.find('.name').text(name);
        this.div.find('.description').text(description);
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
                if (chosenAction && chosenAction in allActionsById) {
                    if (chosenAction === 'RET') {
                        var newAction = new allActionsById[chosenAction](tileContainer, function (value) {
                            self.stop();
                            alert('Return value: ' + value);
                        });
                    } else {
                        var newAction = new allActionsById[chosenAction](tileContainer);
                    }
                    field.setAction(newAction);
                }
                $('.blockpicker').modal('hide');
            });
        });
        tileContainer.on('click', '.action', function (event) {
            if (!self.editable)
                return;
            if ($(this).closest('.action').is('.locked'))
                return;
            var tile = $(this).closest('.tile');
            var field = self.board[tile.data('y')][tile.data('x')];
            field.removeAction();
        });
        this.board[this.startY][this.startX].setAction(new StartAction(tileContainer), false);
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
                this.flappy && this.flappy.die();
                var flappy = this.flappy;
                setTimeout(() => {
                    if (flappy) {
                        flappy.destroy();
                    }
                }, 2000);
                this.flappy = null;
                this.stop();
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
interface BlockSerialized {
    id: string;
    x: number;
    y: number;
}
interface LevelSerialized {
    name: string;
    code: string;
    width: number;
    height: number;
    startX: number;
    startY: number;
    startDirection: Direction;
    description: string;
    blocks?: BlockSerialized[];
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
            '.factory1',
            levelObject.name,
            levelObject.description
        );
        this.description = levelObject.description;
        if (levelObject.blocks) {
            levelObject.blocks.forEach((block: BlockSerialized) => {
                var action = allActionsById[block.id];
                this.factory.board[block.y][block.x].setAction(new action(this.factory.div.find('.tile-container')), false);
            });
        }
    }
    run(speed: number = 100) {
        this.factory.run(speed);
    }
}
var levels = [
    {
        name: 'Level 1: Just press play',
        description: 'The button is below',
        code: '1',
        width: 4,
        height: 4,
        startX: 1,
        startY: 1,
        startDirection: Direction.RIGHT,
        blocks: [
            {
                id: 'ADD',
                y: 1,
                x: 2,
            },
            {
                id: 'DOWN',
                y: 1,
                x: 3,
            },
            {
                id: 'LEFT',
                y: 3,
                x: 3,
            },
            {
                id: 'UP',
                y: 3,
                x: 1,
            },
        ],
    },
    {
        name: 'Level 2: One small step',
        description: 'You need to add one block',
        code: '2',
        width: 4,
        height: 4,
        startX: 1,
        startY: 1,
        startDirection: Direction.RIGHT,
        blocks: [
            {
                id: 'ADD',
                y: 1,
                x: 2,
            },
            {
                id: 'LEFT',
                y: 3,
                x: 3,
            },
            {
                id: 'UP',
                y: 3,
                x: 1,
            },
        ],
    },
    {
        name: 'Level 3: Summer',
        description: 'Re-create the entire puzzle from the previous level',
        code: '3',
        width: 4,
        height: 4,
        startX: 1,
        startY: 1,
        startDirection: Direction.RIGHT,
    }
];
var levelsById = {};
levels.forEach((level: LevelSerialized) => {
    levelsById[level.code] = level;
});
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
$(function () {
    if ($('.factory1').length > 0) {
        var levelCode = getParameterByName('level');
        new Level(levelsById[levelCode]);
    } else if ($('.level-list').length > 0) {
        levels.forEach((level: LevelSerialized) => {
            $("<tr>")
                .append($("<td>").text(level.code))
                .append($("<td>").text(level.name))
                .append($("<td>").text('-'))
                .append($("<td>").text('-'))
                .append($("<td>").text('-'))
                .append($("<td>").text('100'))
                .append($("<td>")
                        .append($("<a>")
                                .addClass('btn btn-primary')
                                .attr('href', 'level.html?level=' + level.code)
                                .text('Play')
                                )
                ).appendTo('.level-list');
        });
    }
    if ($('.blockpicker .actions').length > 0) {
        allActions.forEach((action) => {
            $('.blockpicker .actions').append(
                $('<button type="button" class="btn btn-default btn-lg btn-block" data-action="' + action.identifier + '">').text(action.identifier)
            );
        });
    }
});
