/// <reference path="main.ts"/>

class Action {
    div: JQuery;
    field: Field;
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
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-home">');
    }
    execute(stack: Stack) : Direction {
        return Direction.RIGHT;
    }
}

class UpAction extends Action {
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-arrow-up">');
    }
    execute(stack: Stack) : Direction {
        return Direction.UP;
    }
}
class DownAction extends Action {
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-arrow-down">');
    }
    execute(stack: Stack) : Direction {
        return Direction.DOWN;
    }
}
class LeftAction extends Action {
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-arrow-left">');
    }
    execute(stack: Stack) : Direction {
        return Direction.LEFT;
    }
}
class RightAction extends Action {
    constructor(div: JQuery) {
        super(div);
        this.div.html('<span class="glyphicon glyphicon-arrow-right">');
    }
    execute(stack: Stack) : Direction {
        return Direction.RIGHT;
    }
}
class DupAction extends Action {
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
class ReturnAction extends Action {
    callback: (result: number) => any;
    constructor(div: JQuery, callback: (result: number) => any) {
        super(div);
        this.div.html('RET');
        this.callback = callback;
    }
    execute(stack: Stack) : Direction {
        var val1 = stack.pop();
        this.callback(val1);
        return null;
    }
}
class InputAction extends Action {
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
