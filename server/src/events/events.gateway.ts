import { GameService } from './../game/game.service';
import { Logger } from '@nestjs/common';
import {
    SubscribeMessage,
    MessageBody,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    transport: ['websocket'],
})
export class EventsGateway {
    private readonly logger = new Logger(EventsGateway.name);
    constructor(private readonly gameService: GameService) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('openCell')
    openCell(@MessageBody() data: any) {
        const parsed = JSON.parse(data);

        this.server.emit(
            'state',
            JSON.stringify(
                this.gameService.openCell(parsed.data.i, parsed.data.j)
            )
        );
    }
}
