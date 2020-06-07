class SudokuSolver {
    constructor(board) {
        this.board = board;
        this.i = 0;
        this.solved = false;
        this.unsolved = this.findUnsolvedSpaces();

        //set up Object to record attempted numbers at positions
        this.attempts = {};
        this.unsolved.forEach(coords => {
            this.attempts[`${coords.row}-${coords.column}`] = [];
        })
    }

    findUnsolvedSpaces() {
        let unsolved = [];
        this.board.forEach((row, y) => {
            row.forEach((space, x) => {
                if (space === 0) {
                    unsolved.push({ row: y, column: x });
                }
            });
        });
        return unsolved;
    }

    updateSolvedStatus() {
        let boardNumbers = this.board.flat();
        let numberSet = new Set(boardNumbers);
        this.solved = !(numberSet.has(0)); //cannot be solved if a square has 0
    }

    getNumberAtPosition(coords) {
        // x = column, y = row
        return this.board[coords.row][coords.column];
    }

    setNumberAtPosition(coords, value) {
        // x = column, y = row
        this.board[coords.row][coords.column] = value;
    }

    identifySubSquare(coords) {
        //returns coordinate of top left cell of subsquare
        let rowOffset = coords.row % 3;
        let colOffset = coords.column % 3;
        return {
            row: coords.row - rowOffset,
            column: coords.column - colOffset
        }
    }

    numbersInRow(coords) {
        let row = coords.row;
        let setNumbers = new Set(this.board[row]);
        setNumbers.delete(0);
        return [...setNumbers];
    }

    numbersInColumn(coords) {
        let column = coords.column;
        let numbers = this.board.map(row => {
            return row[column];
        });
        let setNumbers = new Set(numbers);
        setNumbers.delete(0);
        return [...setNumbers];
    }

    numbersInSubSquare(coords) {
        let topLeftCoords = this.identifySubSquare(coords);
        let numbersInSubSquare = this.board.map((row, rowIndex) => {
            if (rowIndex >= topLeftCoords.row && rowIndex <= topLeftCoords.row + 2) {
                let numbers = [];
                for (let column = topLeftCoords.column; column <= topLeftCoords.column + 2; column++) {
                    numbers.push(row[column]);
                }
                return numbers;
            }
            //else ignore as the row doesn't include the subsquare we want
        })
        numbersInSubSquare = numbersInSubSquare.filter(element => { return element != undefined });
        numbersInSubSquare = numbersInSubSquare.flat();

        let setNumbers = new Set(numbersInSubSquare);
        setNumbers.delete(0);
        return [...setNumbers];
    }

    numbersAffectingPosition(coords) {
        let numbersInRow = this.numbersInRow(coords);

        let numbersInColumn = this.numbersInColumn(coords);

        let numbersInSubSquare = this.numbersInSubSquare(coords);

        let allNumbers = numbersInRow.concat(numbersInColumn, numbersInSubSquare);

        return new Set(allNumbers);
    }

    possibleNumbersForPosition(coords) {
        let possibleNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let notPossible = this.numbersAffectingPosition(coords);
        notPossible.forEach(number => {
            possibleNumbers.delete(number);
        });
        return possibleNumbers;
    }

    solveSelf() {
        let i = 0;
        for (i = 0; i < this.unsolved.length; i++) {

            let possibleNumbers = this.possibleNumbersForPosition(this.unsolved[i]); //Set
            let previouslyTried = this.attempts[`${this.unsolved[i].row}-${this.unsolved[i].column}`]; //Array

            previouslyTried.forEach(number => {
                possibleNumbers.delete(number);
            })

            possibleNumbers = [...possibleNumbers]; //convert Set to array

            if (possibleNumbers.length > 0) {
                let choice = possibleNumbers[0];

                this.attempts[`${this.unsolved[i].row}-${this.unsolved[i].column}`].push(choice)
                this.setNumberAtPosition(this.unsolved[i], choice);
                if (i === this.unsolved.length - 1 && (this.findUnsolvedSpaces().length === 0)) {
                    console.log("\n\tSudoku solved!");
                    this.solved = true;
                }
            } else {
                this.setNumberAtPosition(this.unsolved[i], 0);
                this.attempts[`${this.unsolved[i].row}-${this.unsolved[i].column}`] = [];
                i--;
                this.setNumberAtPosition(this.unsolved[i], 0);
                i--;
                if (i < 0) {
                    throw new Error("Unable to solve Sudoku - make sure the board is valid")
                }

            }
        }
    }

}

module.exports = {
    SudokuSolver
}