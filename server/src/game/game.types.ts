export interface GameInterface {
    status: string; //'started' | 'ended';
    diamondsCount: number;
    n: number;
    field: string[][];
    openField: string[][];
    currentPlayer: string; // 'playerOneScore' | 'playerTwoScore';
    playerOneScore: number;
    playerTwoScore: number;
    openCell(x: number, y: number): void;
}

export type CallbackCheckFunc = (i: number, j: number, value: string) => void;
