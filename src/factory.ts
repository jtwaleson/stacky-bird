/// <reference path="main.ts"/>

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

var allActionsById = {};
var allActions: any[] = [
    StartAction,
    DupAction,
    RandomAction,
    UpAction,
    DownAction,
    LeftAction,
    RightAction,
    SwapAction,
    AddAction,
    SubtractAction,
    InputAction,
    UTurnAction,
];

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
        try {
            if (this.flappy === null) {
                this.flappy = new Flappy(this.startX, this.startY, this.startDirection, this);
            } else {
                this.flappy.moveInDirection(this.flappy.direction);
            }
            this.setEditable(false);
            var currentField = this.board[this.flappy.top][this.flappy.left];
            var direction = this.flappy.direction;
            if (currentField.action) {
                direction = currentField.action.execute(this.stack, this.flappy.direction);
            }
            if (direction !== null)
                this.flappy.direction = direction;
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
            this.setMessage('danger', err);
            throw err;
        }
    }
    stepExternal () {
        this.div.find('.factory-play').show();
        this.div.find('.factory-step-forward').show();
        this.div.find('.factory-pause').hide();
        this.div.find('.factory-stop').show();
        this.step();
    }
    run (speed: number = 100) {
        this.currentInterval = setInterval(() => {
            this.step();
        }, speed)
        this.div.find('.factory-play').hide();
        this.div.find('.factory-step-forward').hide();
        this.div.find('.factory-pause').show();
        this.div.find('.factory-stop').show();
        this.hideMessage();
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
        this.setProgress(0);
        this.div.find('.factory-play').show();
        this.div.find('.factory-step-forward').show();
        this.div.find('.factory-pause').hide();
        this.div.find('.factory-stop').hide();
        this.hideMessage();
        this.trigger('stop');
    }
    destroy () {
        this.stop();
        this.div.remove();
        this.div = null;
        this.board = [];
    }
    setProgress (progress: number) {
        this.div.find('.game-progress .progress-bar').css('width', progress + '%');
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
    setMessage(type: string, message: string) {
        var messageDiv = this.div.find('.alert');
        messageDiv.removeClass('alert-success alert-info alert-warning alert-danger');
        messageDiv.text(message);
        messageDiv.addClass('alert-' + type);
        messageDiv.show();
    }
    hideMessage() {
        this.div.find('.alert').hide();
    }
}



