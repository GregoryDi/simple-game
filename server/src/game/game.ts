import { GameInterface } from './game.types';

export class Game implements GameInterface {
    status = 'started';
    currentPlayer = 'playerOneScore';
    diamondsCount = 0;
    n = 0;
    field = [];
    openField = [];
    playerOneScore = 0;
    playerTwoScore = 0;

    constructor(n = 9, diamondsCount = 9) {
        this.diamondsCount = diamondsCount;
        this.n = n;
        const rand = () => Math.floor(Math.random() * this.n);
        // Fill fields with space
        for (let i = 0; i < this.n; i++) {
            this.field.push([]);
            this.openField.push([]);
            for (let j = 0; j < this.n; j++) {
                this.field[i].push(' ');
                this.openField[i].push(' ');
            }
        }

        // Fill field with diamonds - 'X' If random choose existing X, try while
        for (let i = 0; i < this.diamondsCount; i++) {
            let x = rand();
            let y = rand();
            let cell = this.field[x][y];
            if (cell === 'X') {
                let saveCounter = n * n;
                while (cell === 'X' && saveCounter > 0) {
                    x = rand();
                    y = rand();
                    cell = this.field[x][y];
                    saveCounter--;
                }
            }
            this.field[x][y] = 'X';
        }

        // Fill field with numbers
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                if (this.field[i][j] === 'X') continue;
                let count = 0;
                this._checkAroundThePoint({
                    i,
                    j,
                    checkFor: ['X'],
                    cbCheck: () => count++,
                });
                this.field[i][j] = count.toString();
            }
        }
    }

    _checkAroundThePoint({ i, j, checkFor, cbCheck }) {
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                const row = i - 1 + y;
                const col = j - 1 + z;
                const value = this.field[row] && this.field[row][col];
                if (checkFor.includes(value)) cbCheck(row, col, value);
            }
        }
    }

    openCell(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this.n || y >= this.n)
            throw new Error('Invalid cords');
        // check for already opened cell
        if (Boolean(this.openField[x][y].trim())) {
            return;
        }

        this.openField[x][y] = this.field[x][y];

        // check for diamond
        if (this.field[x][y] === 'X') {
            this[this.currentPlayer]++;
            this._checkStatus();
            return;
        }

        // check for zero
        if (this.field[x][y] === '0') {
            const coordsToCheck = new Map();
            coordsToCheck.set(`${x},${y}`, { i: x, j: y, checked: false });
            const getUncheckedCoords = () =>
                Array.from(coordsToCheck.values()).filter((el) => !el.checked);

            let uncheckedCoords = getUncheckedCoords();
            while (uncheckedCoords.length) {
                // get first non checked coords from map
                const { i, j } = uncheckedCoords[0];
                // set coords as checked
                coordsToCheck.set(`${i},${j}`, { i, j, checked: true });

                // check for non zero and no x value and open
                this._checkAroundThePoint({
                    i,
                    j,
                    checkFor: [...Array(10).keys()].map((el) => el.toString()), // '0'-'9' array
                    cbCheck: (i: number, j: number, value: string) => {
                        if (!coordsToCheck.get(`${i},${j}`) && value === '0') {
                            coordsToCheck.set(`${i},${j}`, {
                                i,
                                j,
                                checked: false,
                            });
                        }
                        this.openField[i][j] = this.field[i][j];
                    },
                });

                uncheckedCoords = getUncheckedCoords();
            }
        }

        this.currentPlayer =
            this.currentPlayer === 'playerOneScore'
                ? 'playerTwoScore'
                : 'playerOneScore';
    }

    _checkStatus() {
        if (this.playerOneScore + this.playerTwoScore === this.diamondsCount)
            this.status = 'ended';
    }
}
