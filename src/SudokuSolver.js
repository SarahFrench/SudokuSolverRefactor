class Sudoku {
    constructor(board) {
        this.board = board;
        this.attempts = {};
        this.solveEasySpaces();
        let unsolved = this.findUnsolvedSpaces();
        unsolved.forEach(space => {
            this.attempts[`${space}`] = [];
        })
    }

    isValidChoice(position, choice) {
        if (choice === undefined) {
            console.log("undefined choice passed to isValidChoice");
            return false
        }
        this.updateNumberAtPosition(position, choice);
        if (this.anyErrors()) {
            this.updateNumberAtPosition(position, 0);
            return false
        } else {
            this.updateNumberAtPosition(position, 0);
            return true
        }
    }

    isSolved() {
        let empty_spaces = this.remainingSpace();
        let errors_present = this.anyErrors();
        if (!empty_spaces && !errors_present) {
            return true;
        } else {
            return false;
        }
    }

    column(position) {
        let column = [];
        this.board.forEach(row => {
            column.push(row[position]);
        });
        return column;
    }

    row(position) {
        return this.board[position]
    }

    remainingSpace() {
        let verdict = false;
        this.board.forEach(row => {
            verdict = (row.includes(0) ? true : verdict);
        });
        return verdict
    }

    findNumberAtPosition([x, y]) {
        // x = column, y = row
        return this.row(y)[x];
    }

    updateNumberAtPosition([x, y], value) {
        // x = column, y = row
        // console.log("before:" + this.board[y][x]);
        this.board[y][x] = value;
        // console.log("after:" + this.board[y][x]);
        // this.printBoard()

    }

    identifyThreeByThreeSquare([x, y]) {
        //defined by top left coordinate
        if ([0, 1, 2].includes(x)) {
            if ([0, 1, 2].includes(y)) { return [0, 0]; }
            else if ([3, 4, 5].includes(y)) { return [0, 3]; }
            else if ([6, 7, 8].includes(y)) { return [0, 6]; }
        }
        else if ([3, 4, 5].includes(x)) {
            if ([0, 1, 2].includes(y)) { return [3, 0]; }
            else if ([3, 4, 5].includes(y)) { return [3, 3]; }
            else if ([6, 7, 8].includes(y)) { return [3, 6]; }
        }
        else if ([6, 7, 8].includes(x)) {
            if ([0, 1, 2].includes(y)) { return [6, 0]; }
            else if ([3, 4, 5].includes(y)) { return [6, 3]; }
            else if ([6, 7, 8].includes(y)) { return [6, 6]; }
        }
    }

    findNumbersInThreeByThree([x, y]) {
        let position = this.identifyThreeByThreeSquare([x, y]);
        x = position[0];
        y = position[1];
        let top = this.row(y).slice(x, x + 3);
        let middle = this.row(y + 1).slice(x, x + 3);
        let bottom = this.row(y + 2).slice(x, x + 3);
        let numbers = top.concat(middle).concat(bottom);
        return this.uniqueNumbers(numbers)
    }

    findNumbersAffectingPosition([x, y]) {
        let rowNumbers = this.row(y);
        let columnNumbers = this.column(x);
        let numbers = rowNumbers.concat(columnNumbers);
        let threeByThreeNumbers = this.findNumbersInThreeByThree([x, y]);
        numbers = numbers.concat(threeByThreeNumbers);
        return this.uniqueNumbers(numbers)
    }

    findPossibleNumbersForPosition([x, y]) {
        if (this.findNumberAtPosition([x, y]) === 0) {
            let precludedNumbers = new Set(this.findNumbersAffectingPosition([x, y]));
            let possibleNumbers = difference(NUMBERS, precludedNumbers);
            return possibleNumbers = Array.from(possibleNumbers);
        } else {
            return [];
        }
    }

    uniqueNumbers(number_array) {
        let uniqueNumbers = number_array.filter(x => typeof x === 'number');
        uniqueNumbers = [...new Set(uniqueNumbers)].sort();
        return uniqueNumbers;
    }

    solveEasySpaces() {
        // Finds easy to solve spaces and keeps trying to solve these until they run out
        let shouldLoopContinue = true;

        while (shouldLoopContinue) {
            let changes = [];
            let unsolvedSpaces = this.findUnsolvedSpaces()
            unsolvedSpaces.forEach(position => {
                let possibleNumbers = this.findPossibleNumbersForPosition(position);
                if (possibleNumbers.length === 1) {
                    this.updateNumberAtPosition(position, possibleNumbers[0]);
                    changes.push(true);
                } else {
                    changes.push(false);
                }
            })
            if (!changes.includes(true)) {
                shouldLoopContinue = false;
            }
        }
        if (this.isSolved()) {
            this.solved = true;
            console.log("Sudoku puzzle solved!");
            this.printBoard();
        }
    }

    findUnsolvedSpaces() {
        let unsolved = [];
        this.board.forEach(function (row, y) {
            row.forEach(function (space, x) {
                if (space === 0) {
                    unsolved.push([x, y]);
                }
            })
        })
        return unsolved;
    }

    findUnsolvedSpaceWithFewestOptions() {
        let unsolvedSpaces = this.findUnsolvedSpaces()
        let fewestPossibilities = { position: [], number: 9 }
        unsolvedSpaces.forEach(space => {
            let numberPossibilities = this.findPossibleNumbersForPosition(space).length
            if (numberPossibilities < fewestPossibilities.number && numberPossibilities > 0) {
                fewestPossibilities.number = numberPossibilities
                fewestPossibilities.position = space
            }
        })
        return fewestPossibilities
    }

    anyErrors() {
        let accumulator = [];
        this.board.forEach(row => {
            let numberFrequencies = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 }

            row.forEach(number => {
                if (number) {
                    numberFrequencies[`${number}`] += 1;
                }
            })
            numberFrequencies = Object.values(numberFrequencies);
            let checkingFrequencies = numberFrequencies.map(frequency => frequency > 1)
            if (checkingFrequencies.includes(true)) {
                accumulator.push(true);
            }
        })
        return accumulator.includes(true) ? true : false;
    }

    printBoard() {
        this.board.forEach(row => {
            console.log(row);
        })
    }
}

function solve(sudoku) {
    let unsolved = sudoku.findUnsolvedSpaces();
    for (let i = 0; i < unsolved.length; i++) {
        let possibilities = sudoku.findPossibleNumbersForPosition(unsolved[i]);
        let filteredPossibilities = [];
        possibilities.forEach(x => {
            if (sudoku.attempts[unsolved[i]].includes(x)) {
            } else {
                filteredPossibilities.push(x)
            }
        })
        if (filteredPossibilities.length > 0) {
            let choice = filteredPossibilities[0];
            sudoku.attempts[`${unsolved[i]}`].push(choice)
            sudoku.updateNumberAtPosition(unsolved[i], choice);
            if (i === unsolved.length - 1 && sudoku.isSolved()) {
                console.log("\nSudoku solved, here's the answer:");
                sudoku.printBoard();
                console.log('\n');
            }
        } else {
            sudoku.updateNumberAtPosition(unsolved[i], 0);
            sudoku.attempts[unsolved[i]] = [];
            i--;
            sudoku.updateNumberAtPosition(unsolved[i], 0);
            i--;
        }
    }
}

function isSuperset(set, subset) {
    for (var elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

function difference(setA, setB) {
    var _difference = new Set(setA);
    for (var elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

const NUMBERS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);


let board = [
    [8, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 6, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 9, 0, 2, 0, 0],
    [0, 5, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 0, 0, 4, 5, 7, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 3, 0],
    [0, 0, 1, 0, 0, 0, 0, 6, 8],
    [0, 0, 8, 5, 0, 0, 0, 1, 0],
    [0, 9, 0, 0, 0, 0, 4, 0, 0]
];

let sudoku = new Sudoku(board);

console.log("\nTrying to solve this sudoku:");
console.log(sudoku.printBoard());

solve(sudoku)

console.log(sudoku);
