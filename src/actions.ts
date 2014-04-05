/// <reference path="main.ts"/>

class Action {
    div: JQuery;
    constructor(div) {
        this.div = $('<div class="tile-inner">');
        this.div.appendTo($('<div class="tile">').appendTo(div));
    }
    execute(stack: Stack) : Direction {
        return Direction.UP;
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

class UpAction extends Action {
    constructor(div: JQuery) {
        super(div);
        this.div.html('&#8593;');
    }
    execute(stack: Stack) : Direction {
        return Direction.UP;
    }
}
class DownAction extends Action {
    constructor(div: JQuery) {
        super(div);
        this.div.html('&#8595;');
    }
    execute(stack: Stack) : Direction {
        return Direction.DOWN;
    }
}
class LeftAction extends Action {
    constructor(div: JQuery) {
        super(div);
        this.div.html('&#8592;');
    }
    execute(stack: Stack) : Direction {
        return Direction.LEFT;
    }
}
class RightAction extends Action {
    constructor(div: JQuery) {
        super(div);
        this.div.html('&#8594;');
    }
    execute(stack: Stack) : Direction {
        return Direction.RIGHT;
    }
}
