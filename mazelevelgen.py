from mazelib import Maze
import os

from mazelib.generate.AldousBroder import AldousBroder
from mazelib.generate.BacktrackingGenerator import BacktrackingGenerator
from mazelib.generate.BinaryTree import BinaryTree
from mazelib.generate.CellularAutomaton import CellularAutomaton
from mazelib.generate.Division import Division
from mazelib.generate.DungeonRooms import DungeonRooms
from mazelib.generate.Ellers import Ellers
from mazelib.generate.GrowingTree import GrowingTree
from mazelib.generate.HuntAndKill import HuntAndKill
from mazelib.generate.Kruskal import Kruskal
from mazelib.generate.MazeGenAlgo import MazeGenAlgo
from mazelib.generate.Prims import Prims
from mazelib.generate.Sidewinder import Sidewinder
from mazelib.generate.TrivialMaze import TrivialMaze
from mazelib.generate.Wilsons import Wilsons


algos = [
    AldousBroder,
    BacktrackingGenerator,
    BinaryTree,
    CellularAutomaton,
    Division,
    DungeonRooms,
    Ellers,
    GrowingTree,
    HuntAndKill,
    Kruskal,
    Prims,
    Sidewinder,
    TrivialMaze,
    Wilsons,
]


def gen_level(maze, name, maze_type):
    code = f"0{name}"
    title = f"Maze {name}"
    description = f"Just another {maze_type} Maze"

    objects = []
    maze.grid[maze.start[0]][maze.start[1]] = 2
    maze.grid[maze.end[0]][maze.end[1]] = 3
    for row_idx, row in enumerate(maze.grid[1:-1]):
        for col_idx, col in enumerate(row[1:-1]):
            if col > 0:
                objects.append({
                    "code": "FINI" if col == 3 else "STRT" if col == 2 else "BLCK",
                    "x": col_idx + 1,
                    "y": row_idx + 1,
                })

    filename = os.path.join("src", "levels", "template")
    with open(filename, "r") as fh:
        template = fh.read()

    template = template.replace("TITLE", title)
    template = template.replace("DESCRIPTION", description)
    template = template.replace("UNLOCKS_LEVELS", f"'0{name+1}'")
    template = template.replace("UNLOCKS_INSTRUCTIONS", "")
    template = template.replace("ROWS", str(len(maze.grid) - 2))
    template = template.replace("COLS", str(len(maze.grid[0]) - 2))
    template = template.replace("OBJECTS", "\n".join([f'        {{ x: {o["x"]}, y: {o["y"]}, ...instructions["{o["code"]}"] }},' for o in objects]))
    with open(os.path.join("src", "levels", f"{code}.ts"), "w") as fh:
        fh.write(template)


i = 100
for size in [4, 5, 6, 7]:
    for algo in algos:
        print(algo.__name__)
        m = Maze()
        m.generator = algo(size, size)
        m.generate()
        m.generate_entrances(False, False)
        while m.start[1] >= len(m.grid[0]) - 1 or m.grid[m.start[0]][m.start[1] + 1] == 1:
            m.generate_entrances(False, False)
        print(m)
        print('')
        i += 1
        gen_level(m, i, algo.__name__)
