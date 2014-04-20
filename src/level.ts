/// <reference path="main.ts"/>

interface BlockSerialized {
    id: string;
    x: number;
    y: number;
}

class Level {
    factory: Factory;
    name: string;
    description: string;
    code: string;
    currentAssignment: Assignment = null;
    points: number = 0;
    progress: number = 0;

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
                            id: (<any>cell.action.constructor).identifier,
                            x: cell.left,
                            y: cell.top,
                        });
                    }
                });
            });
            localStorage.setItem('stackybird.levels.' + this.code + '.state', JSON.stringify(state));
        });
        this.factory.on('start', () => {
            if (this.currentAssignment !== null) {
                var output = [];
                try {
                    while (true)
                        output.push(this.factory.stack.pop());
                } catch (err) {
                }
                if (!this.currentAssignment.comparator(output, this.currentAssignment.output)) {
                    throw "answer not correct: got " + output + ' while expecting ' + this.currentAssignment.output;
                }
                this.points += 10;
                this.progress += 10;
                this.factory.setProgress(this.progress);
                if (this.progress === 100) {
                    this.factory.setMessage('success', 'You won!');
                    localStorage.setItem('stackybird.levels.' + this.code + '.score', this.points + '');
                    this.factory.pause();
                }
            }

            this.currentAssignment = levelObject.assignmentGenerator();
            for (var i = 0; i < this.currentAssignment.input.length; i++) {
                this.factory.stack.push(this.currentAssignment.input[i]);
            }
        });
        this.factory.on('stop', () => {
            this.points = 0;
            this.progress = 0;
            this.currentAssignment = null;
        });
    }
    run(speed: number = 100) {
        this.factory.run(speed);
    }
}
