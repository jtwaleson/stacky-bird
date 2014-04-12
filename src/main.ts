/// <reference path="def/jquery/jquery.d.ts"/>
/// <reference path="def/bootstrap/bootstrap.d.ts"/>
/// <reference path="flappy.ts"/>
/// <reference path="actions.ts"/>
/// <reference path="levels.ts"/>

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
    userEditable: boolean;

    constructor(public top: number, public left: number) {
    }

    setAction(action: Action, userEditable: boolean = true) {
        this.action = action;
        this.userEditable = userEditable;
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
        delete this.userEditable;
    }
}
class Factory {
    flappy: Flappy = null;

    board: Field[][] = [];
    currentInterval: number = null;
    stack: Stack = new Stack(this);
    editable: boolean;
    currentAssignment: Assignment = null;
    points: number = 0;
    progress: number = 0;
    handlers: any = {};

    constructor (
        public width: number,
        public height: number,
        public startX: number,
        public startY: number,
        public startDirection: Direction,
        public div: JQuery,
        name: string,
        description: string,
        public assignmentGenerator: () => Assignment
    ) {
        if (width <= 1 || width <= 1) {
            throw "Sizing of Factory should be larger than 1";
        }
        this.div.find('.name').text(name);
        this.div.find('.description').text(description);
        this.setEditable(true);
        var tileContainer = $('<div class="tile-container">').appendTo(this.div.find('.game-container'));;
        var buttons = this.div.find('.game-controls');
        var addButton = (name, title, func) => {
            buttons.append($('<div class="btn-group factory-' + name + '">').append(
                $('<button type="button" class="btn btn-default">').append(
                    $('<span class="glyphicon glyphicon-' + name + '">')
                )
            ).click(func).attr('title', title));
        }
        addButton('stop', 'Stop', (event) => {
            this.stop();
        });
        addButton('pause', 'Pause', (event) => {
            this.pause();
        });
        addButton('step-forward', 'Step', (event) => {
            this.stepExternal();
        });
        addButton('play', 'Play', (event) => {
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
                    var newAction = new allActionsById[chosenAction](self, tileContainer);
                    field.setAction(newAction);
                }
                $('.blockpicker').modal('hide');
                self.trigger('change');
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
            self.trigger('change');
        });
        this.board[this.startY][this.startX].setAction(new StartAction(this, tileContainer), false);
        this.stop();
    }
    on(name: string, func: () => void) {
        this.handlers[name] = this.handlers[name] || [];
        this.handlers[name].push(func);
    }
    trigger(name: string) {
        if (this.handlers[name]) {
            this.handlers[name].forEach(function (func) {
                func();
            });
        }
    }
    addTile(x: number, y: number, text: string) {
        var outerDiv = $('<div>').addClass('tile-position-' + x + '-' + y).addClass('tile');
        var innerDiv = $('<div>').addClass('tile-inner').appendTo(outerDiv);
        innerDiv.text(text);
        outerDiv.addClass('text-length-' + (text.length));
        this.div.find('.tile-container').append(outerDiv);
    }
    step () {
        if (this.flappy && this.flappy.div.is('.dead')) {
            this.stop();
        }
        if (this.flappy === null) {
            this.flappy = new Flappy(this.startX, this.startY, this.startDirection, this);
            return;
        }
        this.setEditable(false);
        try {
            var currentField = this.board[this.flappy.top][this.flappy.left];
            var direction = this.flappy.direction;
            if (currentField.action) {
                var newDirection = currentField.action.execute(this.stack);
                if (newDirection !== null)
                    direction = newDirection;
            }
            this.flappy.moveInDirection(direction);
        } catch (err) {
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
    }
    stepExternal () {
        this.div.find('.factory-play').show();
        this.div.find('.factory-step-forward').show();
        this.div.find('.factory-pause').hide();
        this.div.find('.factory-stop').show();
        this.step()
    }
    run (speed: number = 100) {
        this.currentInterval = setInterval(() => {
            this.step();
        }, speed)
        this.div.find('.factory-play').hide();
        this.div.find('.factory-step-forward').hide();
        this.div.find('.factory-pause').show();
        this.div.find('.factory-stop').show();
    }
    pause () {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
        this.div.find('.factory-play').show();
        this.div.find('.factory-step-forward').show();
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
        this.currentAssignment = null;
        this.points = 0;
        this.setProgress(0);
        this.div.find('.factory-play').show();
        this.div.find('.factory-step-forward').show();
        this.div.find('.factory-pause').hide();
        this.div.find('.factory-stop').hide();
    }
    destroy () {
        this.stop();
        this.div.remove();
        this.div = null;
        this.board = [];
    }
    setProgress (progress: number) {
        this.progress = progress;
        this.div.find('.game-progress .progress-bar').css('width', this.progress * 10 + '%');
    }
    getNextAssignment(stack: Stack) {
        this.currentAssignment = this.assignmentGenerator();
        for (var i = 0; i < this.currentAssignment.input.length; i++) {
            stack.push(this.currentAssignment.input[i]);
        }
    }
    submitAssignment(stack: Stack) {
        if (this.currentAssignment === null) {
            return;
        }
        var output = [];
        try {
            while (true)
                output.push(stack.pop());
        } catch (err) {
        }
        if (!this.currentAssignment.comparator(output, this.currentAssignment.output)) {
            throw "answer not correct: got " + output + ' while expecting ' + this.currentAssignment.output;
        }
        this.points += 10;
        this.setProgress(this.progress + 1);
        if (this.progress === 10) {
            this.stop();
        }
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
interface Assignment {
    input: number[];
    output: number[];
    comparator: (given: number[], expected: number[]) => boolean;
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
    assignmentGenerator: () => Assignment;
}
class Level {
    factory: Factory;
    name: string;
    description: string;
    code: string;

    constructor (levelObject: LevelSerialized) {
        this.name = levelObject.name;
        this.code = levelObject.code;
        this.factory = new Factory(
            levelObject.width,
            levelObject.height,
            levelObject.startX,
            levelObject.startY,
            levelObject.startDirection,
            $('.factory1'),
            levelObject.name,
            levelObject.description,
            levelObject.assignmentGenerator
        );
        this.description = levelObject.description;
        if (levelObject.blocks) {
            levelObject.blocks.forEach((block: BlockSerialized) => {
                var action = allActionsById[block.id];
                this.factory.board[block.y][block.x].setAction(new action(this.factory, this.factory.div.find('.tile-container')), false);
            });
        }
        var savedState = JSON.parse(localStorage.getItem('stackybird.levels.' + this.code + '.state'));
        if (savedState) {
            savedState.forEach((block: BlockSerialized) => {
                var action = allActionsById[block.id];
                if (action) {
                    this.factory.board[block.y][block.x].setAction(new action(this.factory, this.factory.div.find('.tile-container')), true);
                }
            });
        }
        this.factory.on('change', () => {
            var state = [];
            this.factory.board.forEach((row) => {
                row.forEach((cell) => {
                    if (cell.action && cell.userEditable) {
                        state.push({
                            id: cell.action.constructor.identifier,
                            x: cell.left,
                            y: cell.top,
                        });
                    }
                });
            });
            localStorage.setItem('stackybird.levels.' + this.code + '.state', JSON.stringify(state));
        });
    }
    run(speed: number = 100) {
        this.factory.run(speed);
    }
}
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
$(function () {
    if ($('.factory1').length > 0) {
        var levelCode = getParameterByName('level');
        new Level(Levels.byId[levelCode]);
    } else if ($('.level-list').length > 0) {
        Levels.list.forEach((level: LevelSerialized) => {
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
