import { Injectable } from '@nestjs/common';
import { Game, GameInterface } from './game';

@Injectable()
export class GameService {
    currentGame: null | GameInterface;
    constructor() {
        this.currentGame = null;
    }

    startNewGame(n: number, m: number): GameInterface {
        this.currentGame = new Game(n, m);
        return this.getGame();
    }

    openCell(i: number, j: number): GameInterface {
        this.currentGame.openCell(i, j);
        return this.getGame();
    }

    getGame() {
        const game = { ...this.currentGame };
        delete game.field;
        return game;
    }
}
