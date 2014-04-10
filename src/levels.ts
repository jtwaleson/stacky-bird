/// <reference path="main.ts"/>

module Levels {

    var sumAssignmentGenerator = function () : Assignment {
        var comparator = function (given: number[], expected: number[]): boolean {
            if (given.length !== expected.length) {
                return false;
            }
            for (var i = 0; i < given.length; i++) {
                if (given[i] !== expected[i]) {
                    return false;
                }
            }
            return true;
        }
        var a = Math.floor(Math.random() * 10);
        var b = Math.floor(Math.random() * 10);
        return {
            input: [a, b],
            output: [a + b],
            comparator: comparator,
        }
    }


    export var list = [
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
                    y: 2,
                    x: 3,
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
            assignmentGenerator: sumAssignmentGenerator,
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
                    y: 2,
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
            assignmentGenerator: sumAssignmentGenerator,
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
            assignmentGenerator: sumAssignmentGenerator,
        }
    ];
    export var byId = {};
    list.forEach((level: LevelSerialized) => {
        byId[level.code] = level;
    });
}
