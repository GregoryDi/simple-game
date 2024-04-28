import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { GameModule } from './game/game.module';
import { EventsGateway } from './events/events.gateway';

@Module({
    imports: [EventsModule, GameModule],
})
export class AppModule {}
