/// <reference path="main.ts"/>

class Action {
    div: JQuery;
    field: Field;
    static identifier: string = null;
    constructor(div) {
        this.div = $('<div class="tile-inner action">');
        this.div.appendTo($('<div class="tile">').appendTo(div));
    }
    execute(stack: Stack) : Direction {
        return Direction.UP;
    }
    setField(field: Field) {
        this.field = field;
    }
}

class RandomAction extends Action {
    static identifier: string = 'RND';
    constructor(div: JQuery) {
        super(div);
        this.div.text('?');
    }
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

class StartAction extends Action {
    static identifier: string = 'START';
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-home">');
        this.div.closest('.tile').addClass('tile-8');
    }
    execute(stack: Stack) : Direction {
        return Direction.RIGHT;
    }
}

class UpAction extends Action {
    static identifier: string = 'UP';
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-circle-arrow-up">');
    }
    execute(stack: Stack) : Direction {
        return Direction.UP;
    }
}
class DownAction extends Action {
    static identifier: string = 'DOWN';
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-circle-arrow-down">');
    }
    execute(stack: Stack) : Direction {
        return Direction.DOWN;
    }
}
class LeftAction extends Action {
    static identifier: string = 'LEFT';
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-circle-arrow-left">');
    }
    execute(stack: Stack) : Direction {
        return Direction.LEFT;
    }
}
class RightAction extends Action {
    static identifier: string = 'RIGHT';
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-circle-arrow-right">');
    }
    execute(stack: Stack) : Direction {
        return Direction.RIGHT;
    }
}
class DupAction extends Action {
    static identifier: string = 'DUP';
    constructor(div: JQuery) {
        super(div);
        this.div.html('DUP');
    }
    execute(stack: Stack) : Direction {
        var val = stack.pop();
        stack.push(val);
        stack.push(val);
        return null;
    }
}
class SwapAction extends Action {
    static identifier: string = 'SWP';
    constructor(div: JQuery) {
        super(div);
        this.div.html('SWP');
    }
    execute(stack: Stack) : Direction {
        var val1 = stack.pop();
        var val2 = stack.pop();
        stack.push(val1);
        stack.push(val2);
        return null;
    }
}
class AddAction extends Action {
    static identifier: string = 'ADD';
    constructor(div: JQuery) {
        super(div);
        this.div.html('+');
    }
    execute(stack: Stack) : Direction {
        var val2 = stack.pop();
        var val1 = stack.pop();
        stack.push(val1 + val2);
        return null;
    }
}
class SubtractAction extends Action {
    static identifier: string = 'SUB';
    constructor(div: JQuery) {
        super(div);
        this.div.html('-');
    }
    execute(stack: Stack) : Direction {
        var val2 = stack.pop();
        var val1 = stack.pop();
        stack.push(val1 - val2);
        return null;
    }
}
class InputAction extends Action {
    static identifier: string = 'INP';
    constructor(div: JQuery) {
        super(div);
        this.div.html('INP');
    }
    execute(stack: Stack) : Direction {
        var val = parseInt(prompt('Enter whole number'));
        if (isNaN(val)) {
            throw 'invalid value';
        } else {
            stack.push(val);
        }
        return null;
    }
}
