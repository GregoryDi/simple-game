import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GameInterface } from './game';
import { GameService } from './game.service';

@Controller()
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post('/start-new-game')
    startNewGame(@Body() { n }: { n: number }): Omit<GameInterface, 'field'> {
        if (!Number(n) || Number(n) < 3)
            throw new BadRequestException('Invalid params');
        return this.gameService.startNewGame(Number(n), 7);
    }
}
