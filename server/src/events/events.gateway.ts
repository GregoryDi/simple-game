import { GameService } from './../game/game.service';
import { Logger } from '@nestjs/common';
import {
    SubscribeMessage,
    MessageBody,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    transport: ['websocket'],
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(EventsGateway.name);
    constructor(private readonly gameService: GameService) {}

    @WebSocketServer()
    server: Server;

    handleConnection() {
        console.log('USER CONNECTED');
    }

    handleDisconnect() {
        console.log('USER dicconnect');
    }

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
