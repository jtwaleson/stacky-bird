/// <reference path="main.ts"/>

class Action {
    div: JQuery;
    field: Field;
    static identifier: string = null;
    factory: Factory;
    constructor(factory, div) {
        this.factory = factory;
        this.div = $('<div class="tile-inner action">');
        this.div.appendTo($('<div class="tile">').appendTo(div));
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        return Direction.UP;
    }
    setField(field: Field) {
        this.field = field;
    }
}

class UTurnAction extends Action {
    static identifier: string = 'UTURN';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('<span class="glyphicon glyphicon-repeat">');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        if (currentDirection === Direction.UP)
            return Direction.DOWN;
        else if (currentDirection === Direction.DOWN)
            return Direction.UP;
        else if (currentDirection === Direction.RIGHT)
            return Direction.LEFT;
        else if (currentDirection === Direction.LEFT)
            return Direction.RIGHT;
        else
            throw "UTurn exception: current direction is invalid";
    }
}
class RandomAction extends Action {
    static identifier: string = 'RND';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.text('?');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
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

class StartAction extends Action {
    static identifier: string = 'START';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('<span class="glyphicon glyphicon-home">');
        this.div.closest('.tile').addClass('tile-8');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        this.factory.submitAssignment(stack);
        this.factory.getNextAssignment(stack);
        return Direction.RIGHT;
    }
}

class UpAction extends Action {
    static identifier: string = 'UP';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('<span class="glyphicon glyphicon-circle-arrow-up">');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        return Direction.UP;
    }
}
class DownAction extends Action {
    static identifier: string = 'DOWN';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('<span class="glyphicon glyphicon-circle-arrow-down">');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        return Direction.DOWN;
    }
}
class LeftAction extends Action {
    static identifier: string = 'LEFT';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('<span class="glyphicon glyphicon-circle-arrow-left">');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        return Direction.LEFT;
    }
}
class RightAction extends Action {
    static identifier: string = 'RIGHT';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('<span class="glyphicon glyphicon-circle-arrow-right">');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        return Direction.RIGHT;
    }
}
class DupAction extends Action {
    static identifier: string = 'DUP';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('DUP');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        var val = stack.pop();
        stack.push(val);
        stack.push(val);
        return currentDirection;
    }
}
class SwapAction extends Action {
    static identifier: string = 'SWP';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('SWP');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        var val1 = stack.pop();
        var val2 = stack.pop();
        stack.push(val1);
        stack.push(val2);
        return currentDirection;
    }
}
class AddAction extends Action {
    static identifier: string = 'ADD';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('+');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        var val2 = stack.pop();
        var val1 = stack.pop();
        stack.push(val1 + val2);
        return currentDirection;
    }
}
class SubtractAction extends Action {
    static identifier: string = 'SUB';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('-');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        var val2 = stack.pop();
        var val1 = stack.pop();
        stack.push(val1 - val2);
        return currentDirection;
    }
}
class InputAction extends Action {
    static identifier: string = 'INP';
    constructor(factory: Factory, div: JQuery) {
        super(factory, div);
        this.div.html('INP');
    }
    execute(stack: Stack, currentDirection: Direction) : Direction {
        var val = parseInt(prompt('Enter whole number'));
        if (isNaN(val)) {
            throw 'invalid value';
        } else {
            stack.push(val);
        }
        return currentDirection;
    }
}
