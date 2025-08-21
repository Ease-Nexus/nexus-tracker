import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { mapToTimerResultDto, Timer } from 'src/modules/timers/domain';

@WebSocketGateway({
  namespace: '/timers',
  cors: { origin: '*' },
})
export class TimerGateway {
  @WebSocketServer()
  server: Server;

  emitEvent(event: string, timer: Timer) {
    this.server.emit(event, mapToTimerResultDto(timer));
  }

  started(timer: Timer) {
    this.emitEvent('timer.started', timer);
  }

  paused(timer: Timer) {
    this.emitEvent('timer.paused', timer);
  }

  completed(timer: Timer) {
    this.emitEvent('timer.completed', timer);
  }

  tick(timer: Timer) {
    this.emitEvent('timer.tick', timer);
  }
  resumed(timer: Timer) {
    this.emitEvent('timer.resumed', timer);
  }
}
