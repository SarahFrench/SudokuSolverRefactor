const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;

const SudokuSolver = require('../src/sudokuSolver.js').SudokuSolver;

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


describe('Starting state', function () {

    let sudoku = new SudokuSolver(board);

    afterEach(function () {
        sudoku = new SudokuSolver(board);
    });

    it('has unsolved state before solving', function () {
        expect(sudoku.solved).to.be.false;
    });

    it('can identify that it is unsolved', function () {
        sudoku.updateSolvedStatus();
        expect(sudoku.solved).to.be.false;
    });

});

describe('Identifying and changing values at positions', function () {

    let sudoku = new SudokuSolver(board);

    afterEach(function () {
        sudoku = new SudokuSolver(board);
    });

    it('can identify what numbers could go in an empty position', function () {

        let position = { row: 1, column: 0 };
        let possibleNumbers = [1, 2, 4, 5, 9];
        let identifiedNumbers = sudoku.possibleNumbersForPosition(position);

        //all expected numbers have been identified
        possibleNumbers.forEach(possibleNumber => {
            expect(identifiedNumbers.has(possibleNumber));
        })

        //no extra numbers identified
        expect(identifiedNumbers.size).to.be.equal(possibleNumbers.length);

    });

    it('can identify what numbers are in a given row', function () {

        expect(sudoku.numbersInRow({ row: 0, column: undefined }).length).to.be.equal(1)
        expect(sudoku.numbersInRow({ row: 1, column: undefined }).length).to.be.equal(2)
        expect(sudoku.numbersInRow({ row: 2, column: undefined }).length).to.be.equal(3)
        expect(sudoku.numbersInRow({ row: 7, column: undefined }).length).to.be.equal(3)
        expect(sudoku.numbersInRow({ row: 8, column: undefined }).length).to.be.equal(2)

    });

    it('can identify what numbers are in a given column', function () {

        expect(sudoku.numbersInColumn({ row: undefined, column: 0 }).length).to.be.equal(1)
        expect(sudoku.numbersInColumn({ row: undefined, column: 1 }).length).to.be.equal(3)
        expect(sudoku.numbersInColumn({ row: undefined, column: 2 }).length).to.be.equal(3)
        expect(sudoku.numbersInColumn({ row: undefined, column: 7 }).length).to.be.equal(3)
        expect(sudoku.numbersInColumn({ row: undefined, column: 8 }).length).to.be.equal(1)

    });

    it('can identify what numbers are in a given 3x3 subsquare', function () {
        testData = [
            { row: 0, column: 0, subSquareNumbers: [8, 3, 7] },
            { row: 5, column: 5, subSquareNumbers: [1, 4, 5, 7] },
            { row: 0, column: 3, subSquareNumbers: [6, 9] },
            { row: 7, column: 4, subSquareNumbers: [5] },
        ]

        testData.forEach(data => {
            let numbers = sudoku.numbersInSubSquare(data);
            expect(numbers.length).to.be.equal(data.subSquareNumbers.length);

            data.subSquareNumbers.forEach(n => {
                expect(numbers.includes(n)).to.be.true;
            })

        })
    });

    it('can identify what numbers affect a given position', function () {

        let position = { row: 1, column: 1 };
        let numbers = sudoku.numbersAffectingPosition(position);
        expect(numbers.size).to.be.equal(6);
        expect(numbers.has(1)).to.be.false;
        expect(numbers.has(2)).to.be.false;
        expect(numbers.has(3)).to.be.true;
        expect(numbers.has(4)).to.be.false;
        expect(numbers.has(5)).to.be.true;
        expect(numbers.has(6)).to.be.true;
        expect(numbers.has(7)).to.be.true;
        expect(numbers.has(8)).to.be.true;
        expect(numbers.has(9)).to.be.true;

        position = { row: 8, column: 2 };
        numbers = sudoku.numbersAffectingPosition(position);

        expect(numbers.size).to.be.equal(5);
        expect(numbers.has(1)).to.be.true;
        expect(numbers.has(2)).to.be.false;
        expect(numbers.has(3)).to.be.true;
        expect(numbers.has(4)).to.be.true;
        expect(numbers.has(5)).to.be.false;
        expect(numbers.has(6)).to.be.false;
        expect(numbers.has(7)).to.be.false;
        expect(numbers.has(8)).to.be.true;
        expect(numbers.has(9)).to.be.true;

        position = { row: 0, column: 3 };
        numbers = sudoku.numbersAffectingPosition(position);
        expect(numbers.size).to.be.equal(5);
        expect(numbers.has(1)).to.be.true;
        expect(numbers.has(2)).to.be.false;
        expect(numbers.has(3)).to.be.false;
        expect(numbers.has(4)).to.be.false;
        expect(numbers.has(5)).to.be.true;
        expect(numbers.has(6)).to.be.true;
        expect(numbers.has(7)).to.be.false;
        expect(numbers.has(8)).to.be.true;
        expect(numbers.has(9)).to.be.true;
    });

    it('can identify what number is at a given position', function () {
        expect(sudoku.getNumberAtPosition({ row: 0, column: 0 })).to.be.equal(8);
        expect(sudoku.getNumberAtPosition({ row: 1, column: 0 })).to.be.equal(0);
    });

    // it('can change the number at a given position', function () {
    //     let position = { row: 0, column: 0 };
    //     let originalValue = 8;
    //     let newValue = 3; //this is affecting other tests and I don't know why

    //     expect(sudoku.getNumberAtPosition(position)).to.be.equal(originalValue);

    //     sudoku.setNumberAtPosition(position, newValue);

    //     expect(sudoku.getNumberAtPosition(position)).to.be.equal(newValue);


    //     let position2 = { row: 2, column: 4 };
    //     let originalValue2 = 9;
    //     let newValue2 = 8;

    //     expect(sudoku.getNumberAtPosition(position2)).to.be.equal(originalValue2);

    //     sudoku.setNumberAtPosition(position2, newValue2);

    //     expect(sudoku.getNumberAtPosition(position2)).to.be.equal(newValue2);

    // });

});

describe('Identifying positions', function () {

    let sudoku = new SudokuSolver(board);

    afterEach(function () {
        sudoku = new SudokuSolver(board);
    });

    it('can identify the top left corner of the 3x3 sub-square a position falls into', function () {

        //identifying that positions are in the top left subsquare
        let position1a = { row: 0, column: 0 };
        let position1b = { row: 1, column: 1 };
        let position1c = { row: 2, column: 2 };
        let answer1 = { row: 0, column: 0 }

        expect(sudoku.identifySubSquare(position1a).row).to.be.equal(answer1.row);
        expect(sudoku.identifySubSquare(position1a).column).to.be.equal(answer1.column);
        expect(sudoku.identifySubSquare(position1b).row).to.be.equal(answer1.row);
        expect(sudoku.identifySubSquare(position1b).column).to.be.equal(answer1.column);
        expect(sudoku.identifySubSquare(position1c).row).to.be.equal(answer1.row);
        expect(sudoku.identifySubSquare(position1c).column).to.be.equal(answer1.column);

        //identifying that positions are in the centre subsquare
        let position2a = { row: 5, column: 3 };
        let position2b = { row: 4, column: 4 };
        let position2c = { row: 3, column: 5 };
        let answer2 = { row: 3, column: 3 };

        expect(sudoku.identifySubSquare(position2a).row).to.be.equal(answer2.row);
        expect(sudoku.identifySubSquare(position2a).column).to.be.equal(answer2.column);
        expect(sudoku.identifySubSquare(position2b).row).to.be.equal(answer2.row);
        expect(sudoku.identifySubSquare(position2b).column).to.be.equal(answer2.column);
        expect(sudoku.identifySubSquare(position2c).row).to.be.equal(answer2.row);
        expect(sudoku.identifySubSquare(position2c).column).to.be.equal(answer2.column);

        //identifying that positions are in the middle right subsquare
        let position3a = { row: 5, column: 6 };
        let answer3 = { row: 3, column: 6 };

        expect(sudoku.identifySubSquare(position3a).row).to.be.equal(answer3.row);
        expect(sudoku.identifySubSquare(position3a).column).to.be.equal(answer3.column);

        //identifying that positions are in the middle right subsquare
        let position4a = { row: 5, column: 6 };
        let answer4 = { row: 3, column: 6 };

        expect(sudoku.identifySubSquare(position4a).row).to.be.equal(answer4.row);
        expect(sudoku.identifySubSquare(position4a).column).to.be.equal(answer4.column);


    });
});

describe('Solving the sudoku', function () {

    it('solves the sudoku', function () {
        let sudoku = new SudokuSolver(board);
        sudoku.solveSelf();
        expect(sudoku.solved).to.be.true;
    });
});