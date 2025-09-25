import { Module } from '@nestjs/common';
import { EventController } from './step.controller';
import { EventService } from './step.service';

@Module({
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
